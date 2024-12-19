const express = require('express');
const mongoose = require('mongoose');
const { ShapesModel } = require('../db');
// const { ShapesModel } = require('../../Frontend/src/db');


const router = express.Router();

// Middleware to parse JSON requests
router.use(express.json());

// 1. GET - Get all shapes
router.get('/', async (req, res) => {
    try {
        console.log('Received request for shapes');
        const shapes = await ShapesModel.find()
        res.status(200).json(shapes);
    } catch (err) {
        console.error('Error in GET / route:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// 2. Get shapes from a specific user
router.get('/:userId', async (req, res) => {
    try {
        const allShapes = await ShapesModel.find()
        const userShapes = allShapes.filter((shape) => {
            return shape.userId === req.params.userId
        })
        console.log("user Shapes", userShapes)
        res.status(200).json(userShapes);
    } catch (err) {
        console.error('Error in GET / route:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
})

// 3. POST - Create a new shape
router.post('/', async (req, res) => {
    const newShape = req.body;
    try {
        await ShapesModel.create(newShape)
        // const savedShape = await newShape.save();
        res.status(201).json(newShape);
    } catch (error) {
        res.status(400).json({ message: 'Error creating shape', error });
    }
});

// 4. PUT - Update a particular shape by ID
router.put('/:shapeId', async (req, res) => {
    const { shapeId } = req.params;
    try {
        const updatedShape = await ShapesModel.findOneAndUpdate(
            { shapeId },
            req.body,
            { new: true, runValidators: true } // Return the updated document and validate
        );

        if (!updatedShape) {
            return res.status(404).json({ message: 'Shape not found' });
        }

        res.status(200).json(updatedShape);
    } catch (error) {
        res.status(400).json({ message: 'Error updating shape', error });
    }
});
// 5. Delete a shape
router.delete('/:shapeId', async (req, res) => {
    const { shapeId } = req.params;

    try {
        // Find and delete the document based on the custom shapeId field
        const deletedShape = await ShapesModel.findOneAndDelete({ shapeId });

        if (!deletedShape) {
            return res.status(404).json({ message: 'Shape not found' });
        }

        res.status(200).json({ message: 'Shape successfully deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting shape', error: error.message });
    }
});

router.delete('/delete-all', async (req, res) => {
    try {
        await ShapesModel.deleteMany({});
        res.json({ message: "All shapes deleted successfully" });
    } catch (error) {
        console.error("Error deleting shapes:", error);
        res.status(500).json({ error: "Failed to delete shapes" });
    }
});


module.exports = router;
