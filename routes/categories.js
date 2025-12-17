const express = require('express');
const router = express.Router();
const { authenticateToken, isAdmin } = require('../middleware/auth');
const { pool } = require('../config/database');

// Get all categories (Public)
router.get('/', async (req, res) => {
    try {
        const [categories] = await pool.execute(
            'SELECT * FROM categories ORDER BY name ASC'
        );
        res.json({ categories });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get category by ID
router.get('/:id', async (req, res) => {
    try {
        const [categories] = await pool.execute(
            'SELECT * FROM categories WHERE id = ?',
            [req.params.id]
        );
        if (categories.length === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json({ category: categories[0] });
    } catch (error) {
        console.error('Get category error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create category (Admin only)
router.post('/', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { name, icon, description } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Category name is required' });
        }

        const [result] = await pool.execute(
            'INSERT INTO categories (name, icon, description, created_at) VALUES (?, ?, ?, NOW())',
            [name, icon || '💊', description || '']
        );

        res.status(201).json({
            message: 'Category created successfully',
            category: { id: result.insertId, name, icon, description }
        });
    } catch (error) {
        console.error('Create category error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update category (Admin only)
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { name, icon, description } = req.body;
        const updateFields = [];
        const values = [];

        if (name) {
            updateFields.push('name = ?');
            values.push(name);
        }
        if (icon) {
            updateFields.push('icon = ?');
            values.push(icon);
        }
        if (description !== undefined) {
            updateFields.push('description = ?');
            values.push(description);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        values.push(req.params.id);
        await pool.execute(
            `UPDATE categories SET ${updateFields.join(', ')} WHERE id = ?`,
            values
        );

        res.json({ message: 'Category updated successfully' });
    } catch (error) {
        console.error('Update category error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete category (Admin only)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        await pool.execute('DELETE FROM categories WHERE id = ?', [req.params.id]);
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Delete category error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

