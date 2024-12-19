// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const shapeRoutes = require('../routes/shapes'); // Adjust path as needed
// const userRoutes = require('../routes/user');

// const app = express();

// // Middleware
// app.use(express.json());
// app.use(cors());

// // Routes
// app.use('/api/shapes', shapeRoutes);
// app.use('/api/user', userRoutes);

// // MongoDB Connection
// let isConnected = false;
// const connectToDB = async () => {
//     if (!isConnected) {
//         await mongoose.connect('mongodb+srv://prasoon:pAojg4Ta3MpOkgPM@cluster0.re9vc.mongodb.net/Draw', {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//             serverSelectionTimeoutMS: 20000,
//             socketTimeoutMS: 45000,
//         });
//         isConnected = true;
//         console.log('Connected to DB');
//     }
// };

// // Export handler for Vercel
// module.exports = async (req, res) => {
//     await connectToDB(); // Ensure DB connection
//     app(req, res); // Forward request to Express app
// };
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const shapeRoutes = require('../routes/shapes'); // Adjust the path as necessary
const userRoutes = require('../routes/user');
const app = express();

// Middleware to parse JSON
app.use(express.json());
app.use(cors());

// Use the routes
app.use('/api/shapes', shapeRoutes);
app.use('/api/user', userRoutes);

// Start the server with DB connection
const PORT = process.env.PORT || 3010;
mongoose.connect('mongodb+srv://prasoon:pAojg4Ta3MpOkgPM@cluster0.re9vc.mongodb.net/Draw', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 20000, // Increase timeout to 20 seconds
    socketTimeoutMS: 45000, // Increase socket timeout to 45 seconds
})
    .then(() => {
        console.log("Connected to DB");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error("Failed to connect to DB", err);
    });
