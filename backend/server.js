const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const shapeRoutes = require('./routes/shapes');
const userRoutes = require('./routes/user');
const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Adjust origin

// Routes
app.use('/api/shapes', shapeRoutes);
app.use('/api/user', userRoutes);

// MongoDB connection
let isConnected = false; // To track the connection status

const connectToDB = async () => {
    if (!isConnected) {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 20000,
            socketTimeoutMS: 45000,
        });
        isConnected = true;
        console.log('Connected to DB');
    }
};

// Vercel handler
app.use(async (req, res, next) => {
    await connectToDB();
    next();
});

module.exports = app; // No app.listen() for Vercel
