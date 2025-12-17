// routes/userDashboard.js
const express = require('express');
const router = express.Router();
const { authenticateToken, isUser } = require('../middleware/auth');
const { pool } = require('../config/database');

router.get('/dashboard', authenticateToken, isUser, async (req, res) => {
    try {
        const userId = req.user.userId;

        // Get user's orders
        const [orders] = await pool.execute(
            `SELECT 
            o.id,
            o.total,
            o.status,
            UNIX_TIMESTAMP(o.created_at) * 1000 AS created_at,
            GROUP_CONCAT(m.name SEPARATOR ', ') AS items
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN medicines m ON oi.medicine_id = m.id
        WHERE o.user_id = ?
        GROUP BY o.id
        ORDER BY o.created_at DESC
        LIMIT 10
            `,
            [userId]
        );

        // Get cart count
        const [cart] = await pool.execute(
            'SELECT COUNT(*) as count FROM cart WHERE user_id = ?',
            [userId]
        );

        const totalSpent = orders.reduce((sum, o) => sum + parseFloat(o.total || 0), 0);
            res.json({
        orders: orders.map(o => ({
            id: o.id,
            total: parseFloat(o.total),
            status: o.status,
            date: o.created_at,   // ✅ SEND TIMESTAMP AS-IS
            items: o.items || 'No items'
        })),
        stats: {
            totalOrders: orders.length,
            pendingOrders: orders.filter(o => o.status === 'pending').length,
            completedOrders: orders.filter(o => o.status === 'completed').length,
            totalSpent: parseFloat(totalSpent.toFixed(2)),
            cartItems: cart[0].count || 0
        }
    });


    } catch (error) {
        console.error('User dashboard error:', error);
        res.status(500).json({ message: 'Failed to load dashboard' });
    }
});

module.exports = router;