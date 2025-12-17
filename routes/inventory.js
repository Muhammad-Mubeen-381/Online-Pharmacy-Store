const express = require('express');
const router = express.Router();
const { authenticateToken, isAdmin } = require('../middleware/auth');
const { pool } = require('../config/database');

// Get inventory
router.get('/', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { lowStock } = req.query;
        let query = `
            SELECT m.id, m.name, m.stock, m.price, c.name as category_name 
            FROM medicines m 
            LEFT JOIN categories c ON m.category_id = c.id 
            WHERE 1=1
        `;

        if (lowStock === 'true') {
            query += ' AND m.stock < 20 AND m.stock > 0';
        }

        query += ' ORDER BY m.stock ASC';

        const [inventory] = await pool.execute(query);
        res.json({ inventory });
    } catch (error) {
        console.error('Get inventory error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get low stock items
router.get('/low-stock', authenticateToken, isAdmin, async (req, res) => {
    try {
        const [items] = await pool.execute(
            'SELECT * FROM medicines WHERE stock < 20 AND stock > 0 ORDER BY stock ASC'
        );
        res.json({ items });
    } catch (error) {
        console.error('Get low stock error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update inventory
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { stock } = req.body;

        if (stock === undefined) {
            return res.status(400).json({ message: 'Stock value is required' });
        }

        await pool.execute(
            'UPDATE medicines SET stock = ? WHERE id = ?',
            [stock, req.params.id]
        );

        res.json({ message: 'Inventory updated successfully' });
    } catch (error) {
        console.error('Update inventory error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

