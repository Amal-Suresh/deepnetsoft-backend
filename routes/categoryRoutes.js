const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// Create or Update a Category
router.post('/', async (req, res) => {
    try {
        const { id, name, description } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Category name is required' });
        }
        let category;
        if (id) { 
            category = await Category.findByIdAndUpdate(
                id,
                { name, description },
                { new: true }
            );

            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }
        } else {
            category = new Category({ name, description });
            await category.save();
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Error processing request', error: error.message });
    }
});

// Get all categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error: error.message });
    }
});

// Delete a category
router.delete('/:id', async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);
        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting category', error: error.message });
    }
});

module.exports = router;
