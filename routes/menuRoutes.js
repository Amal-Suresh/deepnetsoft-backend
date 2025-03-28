const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const Category = require('../models/Category');

router.post('/', async (req, res) => {
    try {
        const { _id, name, description, price, category } = req.body;

        if (!name || !price || !category) {
            return res.status(400).json({ message: 'Name, Price, and Category ID are required' });
        }

        const cat = await Category.findById(category);
        if (!cat) {
            return res.status(404).json({ message: 'Category not found' });
        }

        let menuItem;
        if (_id) {
          
            menuItem = await MenuItem.findByIdAndUpdate(
                _id,
                { name, description, price, category: category },
                { new: true }
            ).populate('category', 'name description'); 

            if (!menuItem) {
                return res.status(404).json({ message: 'Menu item not found' });
            }
        } else {
            // Create new item
            menuItem = new MenuItem({ name, description, price, category: category });
            await menuItem.save();
            await menuItem.populate('category', 'name description'); 
        }

        res.status(200).json(menuItem);
    } catch (error) {
        res.status(500).json({ message: 'Error processing request', error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        res.status(200).json({ message: 'Menu item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting item', error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const page = Number(req.headers["x-page"]) || 1;  
        const perPage = Number(req.headers["x-per-page"]) || 3;
        const categoryId = req.headers["x-category-id"] || "";

        const filter = categoryId ? { category: categoryId } : {};

        const menuItems = await MenuItem.find(filter)
            .populate('category', 'name description')
            .skip((page - 1) * perPage)  
            .limit(perPage);

        const totalItems = await MenuItem.countDocuments(filter);

        res.status(200).json({
            menuItems,
            totalItems,
            totalPages: Math.ceil(totalItems / perPage),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching items', error: error.message });
    }
});


module.exports = router;
