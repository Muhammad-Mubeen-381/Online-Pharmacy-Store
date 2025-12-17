const express = require('express');
const router = express.Router();
const { authenticateToken, isAdmin, isUser } = require('../middleware/auth');
const { pool } = require('../config/database');

// Get all users (Admin only)
router.get('/', authenticateToken, isAdmin, async (req, res) => {
    try {
        const [users] = await pool.execute(
            'SELECT id, name, email, phone, created_at FROM users ORDER BY created_at DESC'
        );
        res.json({ users });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const [users] = await pool.execute(
            'SELECT id, name, email, phone, created_at FROM users WHERE id = ?',
            [req.user.userId]
        );
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ user: users[0] });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user by ID
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const [users] = await pool.execute(
            'SELECT id, name, email, phone, created_at FROM users WHERE id = ?',
            [req.params.id]
        );
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ user: users[0] });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        // Users can only update their own profile, admins can update any
        if (req.user.userType !== 'admin' && req.user.userId !== parseInt(req.params.id)) {
            return res.status(403).json({ message: 'You can only update your own profile' });
        }

        const { name, email, phone } = req.body;
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

        if (updateFields.length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        values.push(req.params.id);
        await pool.execute(
            `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
            values
        );

        res.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete user (Admin only)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        await pool.execute('DELETE FROM users WHERE id = ?', [req.params.id]);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

