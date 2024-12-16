const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const shapeRoutes = require('../routes/shapes'); // Adjust path as needed
const userRoutes = require('../routes/user');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/shapes', shapeRoutes);
app.use('/api/user', userRoutes);

// MongoDB Connection
let isConnected = false;
const connectToDB = async () => {
    if (!isConnected) {
        await mongoose.connect('mongodb+srv://prasoon:pAojg4Ta3MpOkgPM@cluster0.re9vc.mongodb.net/Draw', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 20000,
            socketTimeoutMS: 45000,
        });
        isConnected = true;
        console.log('Connected to DB');
    }
};

// Export handler for Vercel
module.exports = async (req, res) => {
    await connectToDB(); // Ensure DB connection
    app(req, res); // Forward request to Express app
};
