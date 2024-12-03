const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define a schema for points
const PointSchema = new Schema({
    x: Number,
    y: Number,
});
const ArrowRefSchema = new Schema({
    arrowRef: Number
})

// Main Shapes schema
const ShapesSchema = new Schema({
    shape: { type: String, required: true },
    x: Number, // Used for rectangle, ellipse
    y: Number, // Used for rectangle, ellipse
    width: { type: Number, default: 0 }, // Used for rectangle, ellipse
    height: { type: Number, default: 0 }, // Used for rectangle, ellipse
    diameter: { type: Number, default: 0 }, // Used for circles
    current: { type: Boolean, default: true },
    strokeColor: { type: String, default: '#e03131' },
    backgroundColor: { type: String, default: 'white' },
    fillType: { type: String, default: 'solid' },
    strokeWidth: { type: Number, default: 2 },
    slopiness: { type: Number, default: 0 },
    strokeStyle: { type: [Number], default: [0, 0] }, // array of two numbers
    startX: Number, // Used for lines
    startY: Number, // Used for lines
    endX: Number, // Used for lines
    endY: Number, // Used for lines
    points: [PointSchema], // Array of points for hand shapes
    text: String,
    font: String,
    fontSize: Number,
    borderX: Number,
    borderY: Number,
    borderWidth: Number,
    borderHeight: Number,
    curved: Boolean,
    shapeId: { type: Number, required: true, unique: true },
    userId: { type: String, required: true },
    imageUrl: { type: String },
    ArrowHeadRef: [ArrowRefSchema],
    ArrowLegRef: [ArrowRefSchema],
    textFont: { type: String }
}, { timestamps: true });

const UserSchema = new Schema({
    token: { type: String, required: true, unique: true },
    session: { type: Boolean, default: false },
    shareToken: { type: String },
    createdAt: { type: Date, default: Date.now }
})

const ShapesModel = mongoose.model('shapes', ShapesSchema);
const UserModel = mongoose.model('users', UserSchema)
// Exporting the model
module.exports = {
    ShapesModel: ShapesModel,
    UserModel: UserModel
}
