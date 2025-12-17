const express = require('express');
const router = express.Router();
const { authenticateToken, isUser } = require('../middleware/auth');
const { pool } = require('../config/database');

// Get user's cart
router.get('/', authenticateToken, isUser, async (req, res) => {
    try {
        const [items] = await pool.execute(
            `SELECT c.*, m.name, m.description, m.price, m.image, m.stock 
             FROM cart c 
             LEFT JOIN medicines m ON c.medicine_id = m.id 
             WHERE c.user_id = ?`,
            [req.user.userId]
        );
        res.json({ items });
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add item to cart
router.post('/', authenticateToken, isUser, async (req, res) => {
    try {
        const { medicineId, quantity } = req.body;

        if (!medicineId || !quantity) {
            return res.status(400).json({ message: 'Medicine ID and quantity are required' });
        }

        // Check if item already exists in cart
        const [existing] = await pool.execute(
            'SELECT * FROM cart WHERE user_id = ? AND medicine_id = ?',
            [req.user.userId, medicineId]
        );

        if (existing.length > 0) {
            // Update quantity
            await pool.execute(
                'UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND medicine_id = ?',
                [quantity, req.user.userId, medicineId]
            );
        } else {
            // Add new item
            await pool.execute(
                'INSERT INTO cart (user_id, medicine_id, quantity, created_at) VALUES (?, ?, ?, NOW())',
                [req.user.userId, medicineId, quantity]
            );
        }

        res.json({ message: 'Item added to cart successfully' });
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update cart item quantity
router.put('/:id', authenticateToken, isUser, async (req, res) => {
    try {
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({ message: 'Valid quantity is required' });
        }

        await pool.execute(
            'UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?',
            [quantity, req.params.id, req.user.userId]
        );

        res.json({ message: 'Cart item updated successfully' });
    } catch (error) {
        console.error('Update cart item error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Remove item from cart
router.delete('/:id', authenticateToken, isUser, async (req, res) => {
    try {
        await pool.execute(
            'DELETE FROM cart WHERE id = ? AND user_id = ?',
            [req.params.id, req.user.userId]
        );
        res.json({ message: 'Item removed from cart successfully' });
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Clear cart
router.delete('/', authenticateToken, isUser, async (req, res) => {
    try {
        await pool.execute(
            'DELETE FROM cart WHERE user_id = ?',
            [req.user.userId]
        );
        res.json({ message: 'Cart cleared successfully' });
    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

