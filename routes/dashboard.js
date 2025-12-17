const express = require('express');
const router = express.Router();
const { authenticateToken, isAdmin } = require('../middleware/auth');
const { pool } = require('../config/database');

// Get dashboard stats (Admin only)
router.get('/stats', authenticateToken, isAdmin, async (req, res) => {
    try {
        // Get total users
        const [users] = await pool.execute('SELECT COUNT(*) as count FROM users');
        const totalUsers = users[0]?.count || 0;

        // Get total orders
        const [orders] = await pool.execute('SELECT COUNT(*) as count FROM orders');
        const totalOrders = orders[0]?.count || 0;

        // Get total medicines
        const [medicines] = await pool.execute('SELECT COUNT(*) as count FROM medicines');
        const totalMedicines = medicines[0]?.count || 0;

        // Get total revenue from completed orders (handle NULL case)
        // Using COALESCE to ensure we get 0 instead of NULL when no completed orders exist
        const [revenue] = await pool.execute(
            'SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE status = ?',
            ['completed']
        );
        const totalRevenue = parseFloat(revenue[0]?.total) || 0;

        // Get low stock items (stock < 20 and stock > 0)
        const [lowStock] = await pool.execute(
            'SELECT COUNT(*) as count FROM medicines WHERE stock < 20 AND stock > 0'
        );
        const lowStockItems = parseInt(lowStock[0]?.count) || 0;

        // Get pending orders (status is ENUM, so direct comparison)
        const [pendingOrders] = await pool.execute(
            'SELECT COUNT(*) as count FROM orders WHERE status = ?',
            ['pending']
        );
        const pendingOrdersCount = parseInt(pendingOrders[0]?.count) || 0;

        res.json({
            totalUsers: totalUsers,
            totalOrders: totalOrders,
            totalMedicines: totalMedicines,
            totalRevenue: totalRevenue,
            lowStockItems: lowStockItems,
            pendingOrders: pendingOrdersCount
        });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;

