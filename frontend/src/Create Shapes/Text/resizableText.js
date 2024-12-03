import React, { useRef, useState, useEffect } from "react";

const ResizableTextCanvas = () => {
    const canvasRef = useRef(null);
    const [text, setText] = useState("Edit Me");
    const [fontSize, setFontSize] = useState(20);
    const [isDragging, setIsDragging] = useState(false);
    const [box, setBox] = useState({ x: 100, y: 100, width: 200, height: 50 });

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        drawCanvas(ctx);
    }, [text, fontSize, box]);

    const drawCanvas = (ctx) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Calculate text size and update the box dynamically
        ctx.font = `${fontSize}px Arial`;
        const textWidth = ctx.measureText(text).width;
        const textHeight = fontSize; // Approximation of text height

        setBox((prev) => ({
            ...prev,
            width: textWidth + 20, // Add padding
            height: textHeight + 20,
        }));

        // Draw text
        ctx.fillStyle = "black";
        ctx.fillText(text, box.x + 10, box.y + fontSize + 10);

        // Draw bounding box
        ctx.strokeStyle = "blue";
        ctx.strokeRect(box.x, box.y, box.width, box.height);
    };

    const handleMouseDown = (e) => {
        const { offsetX, offsetY } = e.nativeEvent;
        const isInsideBox =
            offsetX > box.x &&
            offsetX < box.x + box.width &&
            offsetY > box.y &&
            offsetY < box.y + box.height;

        if (isInsideBox) setIsDragging(true);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;

        const { offsetX, offsetY } = e.nativeEvent;
        const newHeight = offsetY - box.y;

        // Update font size based on height
        setFontSize(Math.max(10, newHeight - 20)); // Keep padding in consideration
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleTextChange = (e) => setText(e.target.value);

    return (
        <div>
            <input
                type="text"
                value={text}
                onChange={handleTextChange}
                placeholder="Enter text"
            />
            <canvas
                ref={canvasRef}
                width={800}
                height={600}
                style={{ border: "1px solid black" }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            />
        </div>
    );
};

export default ResizableTextCanvas;
