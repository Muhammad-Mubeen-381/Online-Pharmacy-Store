const express = require('express');
const router = express.Router();
const { authenticateToken, isAdmin, isUser } = require('../middleware/auth');
const { pool } = require('../config/database');
const { sendOrderConfirmationEmail } = require('../utils/emailService');

// Get all orders (Admin) or user's orders (User)
router.get('/', authenticateToken, async (req, res) => {
    try {
        let query = `
            SELECT 
                o.*, 
                u.name as user_name, 
                u.email as user_email,
                (
                    SELECT COALESCE(SUM(oi.quantity), 0) 
                    FROM order_items oi 
                    WHERE oi.order_id = o.id
                ) as items_count
            FROM orders o 
            LEFT JOIN users u ON o.user_id = u.id 
            WHERE 1=1
        `;
        const params = [];

        if (req.user.userType === 'user') {
            query += ' AND o.user_id = ?';
            params.push(req.user.userId);
        }

        const { status, limit } = req.query;
        if (status) {
            query += ' AND o.status = ?';
            params.push(status);
        }

        query += ' ORDER BY o.created_at DESC';

        // Handle LIMIT separately to avoid prepared statement issues
        let limitValue = null;
        if (limit) {
            limitValue = parseInt(limit, 10);
            if (isNaN(limitValue) || limitValue <= 0) {
                limitValue = null;
            }
        }

        // Execute query with or without limit
        let orders;
        if (limitValue) {
            // Use template literal for LIMIT to avoid prepared statement parameter issues
            query += ` LIMIT ${limitValue}`;
            [orders] = await pool.execute(query, params);
        } else {
            [orders] = await pool.execute(query, params);
        }
        res.json({ orders });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user's orders
router.get('/my-orders', authenticateToken, isUser, async (req, res) => {
    try {
        const [orders] = await pool.execute(
            'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
            [req.user.userId]
        );
        res.json({ orders });
    } catch (error) {
        console.error('Get user orders error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get order by ID
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        let query = `
            SELECT o.*, u.name as user_name, u.email as user_email 
            FROM orders o 
            LEFT JOIN users u ON o.user_id = u.id 
            WHERE o.id = ?
        `;
        const params = [req.params.id];

        if (req.user.userType === 'user') {
            query += ' AND o.user_id = ?';
            params.push(req.user.userId);
        }

        const [orders] = await pool.execute(query, params);
        if (orders.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Get order items
        const [items] = await pool.execute(
            'SELECT oi.*, m.name as medicine_name, m.price FROM order_items oi LEFT JOIN medicines m ON oi.medicine_id = m.id WHERE oi.order_id = ?',
            [req.params.id]
        );

        const order = orders[0];

        // Try to find matching address from addresses table based on shipping_address
        // Parse shipping_address to extract components
        let matchingAddress = null;
        if (order.shipping_address && req.user.userType === 'user') {
            try {
                // Get all user addresses and try to match
                const [addresses] = await pool.execute(
                    'SELECT * FROM addresses WHERE user_id = ? ORDER BY created_at DESC',
                    [req.user.userId]
                );
                
                // Try to find a matching address by comparing components
                // This is a simple matching - could be improved
                for (const addr of addresses) {
                    const addrString = `${addr.street}, ${addr.city}, ${addr.state}, ${addr.zip_code}`.toLowerCase();
                    if (order.shipping_address.toLowerCase().includes(addr.street.toLowerCase()) ||
                        order.shipping_address.toLowerCase().includes(addr.city.toLowerCase())) {
                        matchingAddress = addr;
                        break;
                    }
                }
            } catch (error) {
                console.error('Error finding matching address:', error);
            }
        }

        res.json({ 
            order: { 
                ...order, 
                items,
                matchingAddress: matchingAddress // Include matching address if found
            } 
        });
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get order items
router.get('/:id/items', authenticateToken, async (req, res) => {
    try {
        const [items] = await pool.execute(
            'SELECT oi.*, m.name as medicine_name, m.price FROM order_items oi LEFT JOIN medicines m ON oi.medicine_id = m.id WHERE oi.order_id = ?',
            [req.params.id]
        );
        res.json({ items });
    } catch (error) {
        console.error('Get order items error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create order
router.post('/', authenticateToken, isUser, async (req, res) => {
    try {
        const {
            items,
            total,
            shippingAddress,
            paymentMethod,
            // Optional structured address fields (for saving to addresses table)
            addressStreet,
            addressCity,
            addressProvince,
            addressPostalCode,
            addressCountry,
            addressPhone
        } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'Order items are required' });
        }

        if (!total) {
            return res.status(400).json({ message: 'Total is required' });
        }

        // Start transaction
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // Create order
            const [orderResult] = await connection.execute(
                'INSERT INTO orders (user_id, total, status, shipping_address, payment_method, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
                [req.user.userId, total, 'pending', shippingAddress || '', paymentMethod || 'cash']
            );

            const orderId = orderResult.insertId;

            // Create order items and update stock
            for (const item of items) {
                await connection.execute(
                    'INSERT INTO order_items (order_id, medicine_id, quantity, price) VALUES (?, ?, ?, ?)',
                    [orderId, item.medicineId || item.id, item.quantity, item.price]
                );

                // Update medicine stock
                await connection.execute(
                    'UPDATE medicines SET stock = stock - ? WHERE id = ?',
                    [item.quantity, item.medicineId || item.id]
                );

                // Update medicine sales
                await connection.execute(
                    'UPDATE medicines SET sales = sales + ? WHERE id = ?',
                    [item.quantity, item.medicineId || item.id]
                );
            }

            // Store this shipping address in addresses table for the user
            // We only insert if we have at least a street/city/province/postalCode
            let savedAddressId = null;
            if (addressStreet && addressCity && addressProvince && addressPostalCode) {
                const street = addressStreet.trim();
                const city = addressCity.trim();
                const state = addressProvince.trim();
                const zipCode = addressPostalCode.trim();
                const country = addressCountry || 'Pakistan';
                const phone = addressPhone || '';

                // Check if a very similar address already exists for this user to avoid duplicates
                const [existing] = await connection.execute(
                    'SELECT id FROM addresses WHERE user_id = ? AND street = ? AND city = ? AND state = ? AND zip_code = ? LIMIT 1',
                    [req.user.userId, street, city, state, zipCode]
                );

                if (existing.length > 0) {
                    savedAddressId = existing[0].id;
                } else {
                    // Insert new address
                    const [addressResult] = await connection.execute(
                        'INSERT INTO addresses (user_id, street, city, state, zip_code, country, phone, is_default, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())',
                        [req.user.userId, street, city, state, zipCode, country, phone, 0]
                    );
                    savedAddressId = addressResult.insertId;
                }
            }

            // Clear user's cart
            await connection.execute(
                'DELETE FROM cart WHERE user_id = ?',
                [req.user.userId]
            );

            // Create payment record
            const paymentStatus = paymentMethod === 'cod' ? 'pending' : 'completed';
            const transactionId = paymentMethod !== 'cod' ? `TXN-${orderId}-${Date.now()}` : '';
            
            await connection.execute(
                'INSERT INTO payments (order_id, user_id, amount, payment_method, transaction_id, status, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
                [orderId, req.user.userId, total, paymentMethod || 'cash', transactionId, paymentStatus]
            );

            await connection.commit();
            connection.release();

            // Get user information and order items for email
            try {
                const [userInfo] = await pool.execute(
                    'SELECT name, email FROM users WHERE id = ?',
                    [req.user.userId]
                );

                const [orderItemsData] = await pool.execute(
                    `SELECT oi.quantity, oi.price, m.name as medicine_name 
                     FROM order_items oi 
                     LEFT JOIN medicines m ON oi.medicine_id = m.id 
                     WHERE oi.order_id = ?`,
                    [orderId]
                );

                if (userInfo.length > 0 && userInfo[0].email) {
                    // Send order confirmation email (non-blocking)
                    console.log('📧 Sending order confirmation email to:', userInfo[0].email);
                    sendOrderConfirmationEmail(
                        userInfo[0].email,
                        userInfo[0].name,
                        orderId,
                        total,
                        orderItemsData
                    )
                    .then(result => {
                        if (result.success) {
                            console.log('✅ Order confirmation email sent successfully to:', userInfo[0].email);
                        } else {
                            console.error('❌ Failed to send order confirmation email:', result.message || result.error);
                        }
                    })
                    .catch(err => {
                        console.error('❌ Error sending order confirmation email:', err);
                        // Don't fail the order if email fails
                    });
                } else {
                    console.warn('⚠️  User email not found, cannot send order confirmation email');
                }
            } catch (emailError) {
                console.error('Error preparing email data:', emailError);
                // Don't fail the order if email preparation fails
            }

            res.status(201).json({
                message: 'Order created successfully',
                order: { 
                    id: orderId, 
                    total, 
                    status: 'pending',
                    addressId: savedAddressId // Return the address ID if saved
                }
            });
        } catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update order status (Admin only)
router.put('/:id/status', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        await pool.execute(
            'UPDATE orders SET status = ? WHERE id = ?',
            [status, req.params.id]
        );

        res.json({ message: 'Order status updated successfully' });
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

