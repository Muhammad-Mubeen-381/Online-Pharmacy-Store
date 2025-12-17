const express = require('express');
const router = express.Router();
const { authenticateToken, isUser } = require('../middleware/auth');
const { pool } = require('../config/database');

// Create payment
router.post('/', authenticateToken, isUser, async (req, res) => {
    try {
        const { orderId, amount, paymentMethod, transactionId } = req.body;

        if (!orderId || !amount || !paymentMethod) {
            return res.status(400).json({ message: 'Order ID, amount, and payment method are required' });
        }

        const [result] = await pool.execute(
            'INSERT INTO payments (order_id, user_id, amount, payment_method, transaction_id, status, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
            [orderId, req.user.userId, amount, paymentMethod, transactionId || '', 'completed']
        );

        res.status(201).json({
            message: 'Payment created successfully',
            payment: { id: result.insertId, ...req.body }
        });
    } catch (error) {
        console.error('Create payment error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get payment by ID
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        let query = 'SELECT * FROM payments WHERE id = ?';
        const params = [req.params.id];

        if (req.user.userType === 'user') {
            query += ' AND user_id = ?';
            params.push(req.user.userId);
        }

        const [payments] = await pool.execute(query, params);
        if (payments.length === 0) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.json({ payment: payments[0] });
    } catch (error) {
        console.error('Get payment error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get payments for an order
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { orderId } = req.query;

        if (!orderId) {
            return res.status(400).json({ message: 'Order ID is required' });
        }

        let query = 'SELECT * FROM payments WHERE order_id = ?';
        const params = [orderId];

        if (req.user.userType === 'user') {
            query += ' AND user_id = ?';
            params.push(req.user.userId);
        }

        const [payments] = await pool.execute(query, params);
        res.json({ payments });
    } catch (error) {
        console.error('Get payments error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

