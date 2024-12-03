const express = require("express");
const multer = require("multer");
const cors = require('cors');
const path = require("path");

const app = express();
app.use(cors());
// Set up storage destination and file naming
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Folder to save images
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
    },
});

const upload = multer({ storage });

// Route to handle file upload
app.post("/upload", upload.single("image"), (req, res) => {
    const filePath = path.join("uploads", req.file.filename);
    res.json({ url: `http://localhost:3030/${filePath}` });
});

// Serve static files from the 'uploads' folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(3030, () => {
    console.log("Server running on http://localhost:3030");
});
