const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const shapeRoutes = require('./routes/shapes'); // Adjust the path as necessary

const app = express();

// Middleware to parse JSON
app.use(express.json());
app.use(cors());
// Use the shapes router
app.use('/api/shapes', shapeRoutes);

// Start the server
const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


app.listen(3005, async () => {
    try {
        await mongoose.connect('mongodb+srv://prasoon:Z68Ypr7A1xDbyIeI@cluster0.re9vc.mongodb.net/Draw', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to DB");
    } catch (err) {
        console.error("Failed to connect to DB", err);
    }
});
