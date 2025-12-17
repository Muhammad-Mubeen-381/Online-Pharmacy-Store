const express = require('express');
const router = express.Router();
const { authenticateToken, isUser } = require('../middleware/auth');
const { pool } = require('../config/database');

// Get user's addresses
router.get('/', authenticateToken, isUser, async (req, res) => {
    try {
        const [addresses] = await pool.execute(
            'SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC',
            [req.user.userId]
        );
        res.json({ addresses });
    } catch (error) {
        console.error('Get addresses error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get address by ID
router.get('/:id', authenticateToken, isUser, async (req, res) => {
    try {
        const [addresses] = await pool.execute(
            'SELECT * FROM addresses WHERE id = ? AND user_id = ?',
            [req.params.id, req.user.userId]
        );
        if (addresses.length === 0) {
            return res.status(404).json({ message: 'Address not found' });
        }
        res.json({ address: addresses[0] });
    } catch (error) {
        console.error('Get address error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create address
router.post('/', authenticateToken, isUser, async (req, res) => {
    try {
        const { street, city, state, zipCode, country, phone, isDefault } = req.body;

        if (!street || !city || !state || !zipCode || !country) {
            return res.status(400).json({ message: 'All address fields are required' });
        }

        // If this is set as default, unset other defaults
        if (isDefault) {
            await pool.execute(
                'UPDATE addresses SET is_default = 0 WHERE user_id = ?',
                [req.user.userId]
            );
        }

        const [result] = await pool.execute(
            'INSERT INTO addresses (user_id, street, city, state, zip_code, country, phone, is_default, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())',
            [req.user.userId, street, city, state, zipCode, country, phone || '', isDefault ? 1 : 0]
        );

        res.status(201).json({
            message: 'Address created successfully',
            address: { id: result.insertId, ...req.body }
        });
    } catch (error) {
        console.error('Create address error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update address
router.put('/:id', authenticateToken, isUser, async (req, res) => {
    try {
        const { street, city, state, zipCode, country, phone, isDefault } = req.body;
        const updateFields = [];
        const values = [];

        if (street) {
            updateFields.push('street = ?');
            values.push(street);
        }
        if (city) {
            updateFields.push('city = ?');
            values.push(city);
        }
        if (state) {
            updateFields.push('state = ?');
            values.push(state);
        }
        if (zipCode) {
            updateFields.push('zip_code = ?');
            values.push(zipCode);
        }
        if (country) {
            updateFields.push('country = ?');
            values.push(country);
        }
        if (phone !== undefined) {
            updateFields.push('phone = ?');
            values.push(phone);
        }
        if (isDefault !== undefined) {
            if (isDefault) {
                // Unset other defaults first
                await pool.execute(
                    'UPDATE addresses SET is_default = 0 WHERE user_id = ?',
                    [req.user.userId]
                );
            }
            updateFields.push('is_default = ?');
            values.push(isDefault ? 1 : 0);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        values.push(req.params.id, req.user.userId);
        await pool.execute(
            `UPDATE addresses SET ${updateFields.join(', ')} WHERE id = ? AND user_id = ?`,
            values
        );

        res.json({ message: 'Address updated successfully' });
    } catch (error) {
        console.error('Update address error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Set default address
router.put('/:id/set-default', authenticateToken, isUser, async (req, res) => {
    try {
        // Unset all defaults
        await pool.execute(
            'UPDATE addresses SET is_default = 0 WHERE user_id = ?',
            [req.user.userId]
        );

        // Set this as default
        await pool.execute(
            'UPDATE addresses SET is_default = 1 WHERE id = ? AND user_id = ?',
            [req.params.id, req.user.userId]
        );

        res.json({ message: 'Default address updated successfully' });
    } catch (error) {
        console.error('Set default address error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete address
router.delete('/:id', authenticateToken, isUser, async (req, res) => {
    try {
        await pool.execute(
            'DELETE FROM addresses WHERE id = ? AND user_id = ?',
            [req.params.id, req.user.userId]
        );
        res.json({ message: 'Address deleted successfully' });
    } catch (error) {
        console.error('Delete address error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

