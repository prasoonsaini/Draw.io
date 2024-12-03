// import React from "react";
import { MdImage } from "react-icons/md";
import './ImageUpload.css'
import handleImageUpload from "./handleImageUpload";
function ImageUpload({ canvasRef, setAllshapes, setCurrentShape, currentShape, user }) {
    console.log("this is the user from image upload", user)
    return (
        <div className="upload-widget">
            <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, canvasRef, setAllshapes, setCurrentShape, currentShape, user)}
            />
        </div>
    );
}

export default ImageUpload;
