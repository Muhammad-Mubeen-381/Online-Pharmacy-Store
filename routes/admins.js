const express = require('express');
const router = express.Router();
const { authenticateToken, isAdmin } = require('../middleware/auth');
const { pool } = require('../config/database');

// Get all admins (Admin only)
router.get('/', authenticateToken, isAdmin, async (req, res) => {
    try {
        const [admins] = await pool.execute(
            'SELECT id, name, email, phone, role, created_at FROM admins ORDER BY created_at DESC'
        );
        res.json({ admins });
    } catch (error) {
        console.error('Get admins error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get admin by ID
router.get('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const [admins] = await pool.execute(
            'SELECT id, name, email, phone, role, created_at FROM admins WHERE id = ?',
            [req.params.id]
        );
        if (admins.length === 0) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.json({ admin: admins[0] });
    } catch (error) {
        console.error('Get admin error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update admin
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { name, email, phone, role } = req.body;
        const updateFields = [];
        const values = [];

        if (name) {
            updateFields.push('name = ?');
            values.push(name);
        }
        if (email) {
            updateFields.push('email = ?');
            values.push(email);
        }
        if (phone) {
            updateFields.push('phone = ?');
            values.push(phone);
        }
        if (role) {
            updateFields.push('role = ?');
            values.push(role);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        values.push(req.params.id);
        await pool.execute(
            `UPDATE admins SET ${updateFields.join(', ')} WHERE id = ?`,
            values
        );

        res.json({ message: 'Admin updated successfully' });
    } catch (error) {
        console.error('Update admin error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

