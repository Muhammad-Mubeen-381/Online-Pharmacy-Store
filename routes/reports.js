const express = require('express');
const router = express.Router();
const { authenticateToken, isAdmin } = require('../middleware/auth');
const { pool } = require('../config/database');

// Get sales report
router.get('/sales', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let query = `
            SELECT DATE(created_at) as date, COUNT(*) as order_count, SUM(total) as revenue 
            FROM orders 
            WHERE status = 'completed'
        `;
        const params = [];

        if (startDate) {
            query += ' AND DATE(created_at) >= ?';
            params.push(startDate);
        }
        if (endDate) {
            query += ' AND DATE(created_at) <= ?';
            params.push(endDate);
        }

        query += ' GROUP BY DATE(created_at) ORDER BY date DESC';

        const [sales] = await pool.execute(query, params);
        res.json({ sales });
    } catch (error) {
        console.error('Get sales report error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get top selling medicines
router.get('/top-medicines', authenticateToken, isAdmin, async (req, res) => {
    try {
        let limit = parseInt(req.query.limit, 10);
        if (isNaN(limit) || limit <= 0) {
            limit = 10;
        }
        // Use template literal for LIMIT to avoid prepared statement parameter issues
        const [medicines] = await pool.execute(
            `SELECT * FROM medicines ORDER BY sales DESC LIMIT ${limit}`
        );
        res.json({ medicines });
    } catch (error) {
        console.error('Get top medicines error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

