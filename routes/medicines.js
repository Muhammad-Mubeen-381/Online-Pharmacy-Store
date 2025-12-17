const express = require('express');
const router = express.Router();
const { authenticateToken, isAdmin } = require('../middleware/auth');
const { pool } = require('../config/database');

// Get all medicines (Public)
router.get('/', async (req, res) => {
    try {
        const { categoryId, search } = req.query;
        let query = 'SELECT m.*, c.name as category_name FROM medicines m LEFT JOIN categories c ON m.category_id = c.id WHERE 1=1';
        const params = [];

        if (categoryId) {
            query += ' AND m.category_id = ?';
            params.push(categoryId);
        }

        if (search && search.trim() !== '') {
            query += ' AND m.name LIKE ?';
            params.push(`${search.trim()}%`); // 👈 NO % at start
        }
        query += ' ORDER BY id ';

        const [medicines] = await pool.execute(query, params);
        res.json({ medicines });
    } catch (error) {
        console.error('Get medicines error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get medicine by ID
router.get('/:id', async (req, res) => {
    try {
        const [medicines] = await pool.execute(
            'SELECT m.*, c.name as category_name FROM medicines m LEFT JOIN categories c ON m.category_id = c.id WHERE m.id = ?',
            [req.params.id]
        );
        if (medicines.length === 0) {
            return res.status(404).json({ message: 'Medicine not found' });
        }
        res.json({ medicine: medicines[0] });
    } catch (error) {
        console.error('Get medicine error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create medicine (Admin only)
router.post('/', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { name, description, price, categoryId, stock, image, sales, rating } = req.body;

        if (!name || !price || !categoryId) {
            return res.status(400).json({ message: 'Name, price, and categoryId are required' });
        }

        const [result] = await pool.execute(
            'INSERT INTO medicines (name, description, price, category_id, stock, image, sales, rating, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())',
            [name, description || '', price, categoryId, stock || 0, image || '💊', sales || 0, rating || 4.0]
        );

        res.status(201).json({
            message: 'Medicine created successfully',
            medicine: { id: result.insertId, ...req.body }
        });
    } catch (error) {
        console.error('Create medicine error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update medicine (Admin only)
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { name, description, price, categoryId, stock, image, sales, rating } = req.body;
        const updateFields = [];
        const values = [];

        if (name) {
            updateFields.push('name = ?');
            values.push(name);
        }
        if (description !== undefined) {
            updateFields.push('description = ?');
            values.push(description);
        }
        if (price) {
            updateFields.push('price = ?');
            values.push(price);
        }
        if (categoryId) {
            updateFields.push('category_id = ?');
            values.push(categoryId);
        }
        if (stock !== undefined) {
            updateFields.push('stock = ?');
            values.push(stock);
        }
        if (image) {
            updateFields.push('image = ?');
            values.push(image);
        }
        if (sales !== undefined) {
            updateFields.push('sales = ?');
            values.push(sales);
        }
        if (rating !== undefined) {
            updateFields.push('rating = ?');
            values.push(rating);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        values.push(req.params.id);
        await pool.execute(
            `UPDATE medicines SET ${updateFields.join(', ')} WHERE id = ?`,
            values
        );

        res.json({ message: 'Medicine updated successfully' });
    } catch (error) {
        console.error('Update medicine error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete medicine (Admin only)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        await pool.execute('DELETE FROM medicines WHERE id = ?', [req.params.id]);
        res.json({ message: 'Medicine deleted successfully' });
    } catch (error) {
        console.error('Delete medicine error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

