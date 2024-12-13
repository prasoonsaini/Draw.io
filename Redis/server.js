// const express = require('express');
// const redis = require('redis');
// const cors = require('cors');
import express from 'express'
import redis from 'redis'
import cors from 'cors'
// const { default: dumpData } = require('./dump');
import dumpData from './dump.js'
const app = express();
app.use(express.json()); // Middleware to parse JSON request body
app.use(cors())
const key = "shapes"
// Connect to Redis
const client = redis.createClient({
    url: 'redis://host.docker.internal:6379', // Connect to Redis running on the host
});


client.connect()
    .then(() => console.log('Connected to Redis'))
    .catch((err) => console.error('Redis connection error:', err));

/**
 * GET /shapes - Retrieve all shapes from Redis
 */
app.get('/shapes', async (req, res) => {
    try {
        const value = await client.lRange(key, 0, -1); // Fetch all items from the list
        if (!value.length) {
            return res.status(404).json({ message: 'No shapes found' });
        }
        res.json({ shapes: value.map(JSON.parse) }); // Parse each item in the list
    } catch (err) {
        console.error('Error retrieving shapes:', err);
        res.status(500).json({ message: 'Error retrieving shapes' });
    }
});

app.get('/shapes/:userId', async (req, res) => {
    const userId = req.params.userId;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        // Retrieve all shapes from Redis
        const shapesList = await client.lRange(key, 0, -1);
        const parsedShapes = shapesList.map(shape => JSON.parse(shape));
        // const exist = await client.exists(userId)
        const currentTime = new Date().toISOString();
        const userIdKey = userId
        await client.set(userIdKey, currentTime)
        // Filter shapes based on the userId
        const userShapes = parsedShapes.filter(shape => shape.userId === userId);

        if (userShapes.length === 0) {
            return res.status(404).json({ message: 'No shapes found for this user' });
        }

        // Return the filtered shapes for the specific user
        res.status(200).json({ userId, shapes: userShapes });
    } catch (err) {
        console.error('Error retrieving user shapes:', err);
        res.status(500).json({ message: 'Error retrieving shapes' });
    }
});

/**
 * POST /shapes - Add a new shape to Redis
 */
app.post('/shapes', async (req, res) => {
    const value = req.body;
    const userId = value.userId
    if (!value) {
        return res.status(400).json({ message: 'Shape data is required' });
    }
    try {
        // Push new shape to the Redis list
        await client.rPush(key, JSON.stringify(value));
        const currentTime = new Date().toISOString();
        const userIdKey = userId
        await client.set(userIdKey, currentTime)
        res.status(201).json({ message: 'Shape added successfully', value });
    } catch (err) {
        console.error('Error adding shape:', err);
        res.status(500).json({ message: 'Error adding shape' });
    }
});

/**
 * PUT /shapes/:index - Update a shape at a specific index in Redis
 */
app.put('/shapes/:shapeId', async (req, res) => {
    const value = req.body;
    const shapeId = parseInt(req.params.shapeId, 10);
    const userId = value.userId
    if (!value || isNaN(shapeId)) {
        return res.status(400).json({ message: 'Valid shape data and shape ID are required' });
    }

    try {
        // Retrieve the list of shapes
        const shapesList = await client.lRange(key, 0, -1);
        const currentTime = new Date().toISOString();
        const userIdKey = userId
        await client.set(userIdKey, currentTime)
        const parsedShapes = shapesList.map(shape => JSON.parse(shape));

        // Filter out the shape with the matching shapeId and update it
        let shapeFound = false;
        const updatedShapes = parsedShapes.map(shape => {
            if (shape.shapeId === shapeId) {
                shapeFound = true;
                return { ...shape, ...value };  // Merge new data into the shape
            }
            return shape;  // Keep other shapes unchanged
        });

        if (!shapeFound) {
            return res.status(404).json({ message: 'Shape not found' });
        }

        // Clear the existing list and re-add the updated shapes in one transaction
        const multi = client.multi();
        await multi.del(key);
        updatedShapes.forEach(shape => multi.rPush(key, JSON.stringify(shape)));
        await multi.exec();

        res.status(200).json({ message: 'Shape updated successfully', updatedShape: value });
    } catch (err) {
        console.error('Error updating shape:', err);
        res.status(500).json({ message: 'Error updating shape' });
    }
});



app.delete('/shapes/:shapeId', async (req, res) => {
    const shapeId = parseInt(req.params.shapeId); // Ensure shapeId is a number
    const userId = req.header('userId')
    console.log("userId", userId)
    if (!shapeId) {
        return res.status(400).json({ message: 'Shape ID is required' });
    }

    try {
        // Retrieve the list of shapes
        const shapesList = await client.lRange(key, 0, -1);
        const currentTime = new Date().toISOString();
        const userIdKey = userId
        await client.set(userIdKey, currentTime)
        const parsedShapes = shapesList.map(shape => JSON.parse(shape));

        // Filter out the shape with the matching shapeId
        const updatedShapes = parsedShapes.filter(shape => shape.shapeId !== shapeId);

        if (updatedShapes.length === parsedShapes.length) {
            return res.status(404).json({ message: 'Shape not found' });
        }

        // Clear the existing list and re-add the remaining shapes
        await client.del(key);  // Delete existing list

        for (const shape of updatedShapes) {
            await client.rPush(key, JSON.stringify(shape));  // Re-add remaining shapes
        }

        res.status(200).json({ message: 'Shape deleted successfully' });
    } catch (err) {
        console.error('Error deleting shape:', err);
        res.status(500).json({ message: 'Error deleting shape' });
    }
});

app.post('/user/:userId', async (req, res) => {
    const user_key = "users"; // Redis key to store user IDs
    const userId = req.params.userId;

    try {
        const exists = await client.exists(user_key);

        if (exists) {
            const list = await client.lRange(user_key, 0, -1);
            const currentTime = new Date().toISOString();
            const userIdKey = userId
            await client.set(userIdKey, currentTime)
            if (list.includes(JSON.stringify(userId))) {
                return res.json({ exist: true });
            } else {
                await client.rPush(user_key, JSON.stringify(userId));
                return res.json({ exist: false });
            }
        } else {
            // Key doesn't exist, initialize it and add the user ID
            await client.rPush(user_key, JSON.stringify(userId));
            return res.json({ exist: false });
        }
    } catch (error) {
        console.error("Error checking user existence:", error);
        res.status(500).json({ message: 'Error checking user existence' });
    }
});

app.delete('/user-shapes/:userId', async (req, res) => {
    const userId = req.params.userId; // Ensure shapeId is a number
    // const userId = req.header('userId')
    console.log("userId", userId)
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        // Retrieve the list of shapes
        const shapesList = await client.lRange(key, 0, -1);
        const parsedShapes = shapesList.map(shape => JSON.parse(shape));

        const filtered_shapes = parsedShapes.filter((e) => {
            if (e.userId !== userId) {
                return true;
            }
        })
        await client.del(key);
        if (filtered_shapes.length > 0) {
            const stringifiedShapes = filtered_shapes.map((shape) => JSON.stringify(shape));
            await client.rPush(key, ...stringifiedShapes);
            console.log(`New key "${key}" created with odd index values.`);
        } else {
            console.log('No values to add to the new key.');
        }

        res.status(200).json({ message: `All Shapes with ${userId} deleted successfully` });
    } catch (err) {
        console.error('Error deleting shape:', err);
        res.status(500).json({ message: 'Error deleting shape' });
    }
});

// Start the server
app.listen(3020, () => {
    console.log('Server running on http://localhost:3020');
});



setInterval(async () => {
    const exists = await client.exists(key);
    // if (!exists) {
    //     console.log("shapes does not exist")
    //     return;
    // } else {
    console.log("called to dump");
    const user_key = "users";
    const res = await client.lRange(user_key, 0, -1);

    // Remove extra quotes around each user key
    const userKeys = res.map(user => JSON.parse(user));
    console.log("userKey", userKeys)
    for (const user of userKeys) {
        console.log("Checking user key:", user);
        const ex = await client.exists(user);
        console.log("Exists:", ex);

        if (!ex) {
            console.log(`Key for user ${user} does not exist`);
            continue;
        }

        const reply = await client.get(user);
        console.log("Reply:", reply);
        if (reply) {
            const storedTime = new Date(reply).getTime(); // Convert ISO string to timestamp
            const currentTime = Date.now();
            const timeDifference = currentTime - storedTime;

            console.log(user, currentTime, storedTime, timeDifference);

            // Check if time difference is within the defined range
            if (timeDifference >= 60 * 60 * 1000) {
                console.log("Dump for", user);
                await dumpData(client, user); // Call the function if within the time range
            }
        } else {
            console.log(`No value found for key: ${user}`);
        }
        // }
    }
}, 30 * 60 * 1000);
