const express = require('express');
const router = express.Router();
const { authenticateToken, isUser } = require('../middleware/auth');
const { pool } = require('../config/database');

// Get reviews for a medicine
router.get('/', async (req, res) => {
    try {
        const { medicineId } = req.query;

        if (!medicineId) {
            return res.status(400).json({ message: 'Medicine ID is required' });
        }

        const [reviews] = await pool.execute(
            `SELECT r.*, u.name as user_name 
             FROM reviews r 
             LEFT JOIN users u ON r.user_id = u.id 
             WHERE r.medicine_id = ? 
             ORDER BY r.created_at DESC`,
            [medicineId]
        );
        res.json({ reviews });
    } catch (error) {
        console.error('Get reviews error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create review
router.post('/', authenticateToken, isUser, async (req, res) => {
    try {
        const { medicineId, rating, comment } = req.body;

        if (!medicineId || !rating) {
            return res.status(400).json({ message: 'Medicine ID and rating are required' });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        const [result] = await pool.execute(
            'INSERT INTO reviews (user_id, medicine_id, rating, comment, created_at) VALUES (?, ?, ?, ?, NOW())',
            [req.user.userId, medicineId, rating, comment || '']
        );

        // Update medicine average rating
        const [avgRating] = await pool.execute(
            'SELECT AVG(rating) as avg_rating FROM reviews WHERE medicine_id = ?',
            [medicineId]
        );
        await pool.execute(
            'UPDATE medicines SET rating = ? WHERE id = ?',
            [avgRating[0].avg_rating || 4.0, medicineId]
        );

        res.status(201).json({
            message: 'Review created successfully',
            review: { id: result.insertId, ...req.body }
        });
    } catch (error) {
        console.error('Create review error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update review
router.put('/:id', authenticateToken, isUser, async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const updateFields = [];
        const values = [];

        if (rating) {
            if (rating < 1 || rating > 5) {
                return res.status(400).json({ message: 'Rating must be between 1 and 5' });
            }
            updateFields.push('rating = ?');
            values.push(rating);
        }
        if (comment !== undefined) {
            updateFields.push('comment = ?');
            values.push(comment);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        values.push(req.params.id, req.user.userId);
        await pool.execute(
            `UPDATE reviews SET ${updateFields.join(', ')} WHERE id = ? AND user_id = ?`,
            values
        );

        res.json({ message: 'Review updated successfully' });
    } catch (error) {
        console.error('Update review error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete review
router.delete('/:id', authenticateToken, isUser, async (req, res) => {
    try {
        await pool.execute(
            'DELETE FROM reviews WHERE id = ? AND user_id = ?',
            [req.params.id, req.user.userId]
        );
        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Delete review error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

