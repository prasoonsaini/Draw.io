import React, { useState } from 'react';
import { Rect } from 'react-konva';

const Rectangle = () => {
  const [rect, setRect] = useState(null); // State to store rectangle details
  const [isDrawing, setIsDrawing] = useState(false); // State to track if drawing is in progress
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 }); // Starting point of the rectangle

  const handleMouseDown = (e) => {
    //console.log("Mouse down")
    const { x, y } = e.target.getStage().getPointerPosition(); // Get the current mouse position
    setStartPoint({ x, y }); // Set the starting point
    setIsDrawing(true); // Set drawing state to true
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return; // If not drawing, do nothing

    const { x, y } = e.target.getStage().getPointerPosition(); // Get current mouse position
    setRect({
      x: Math.min(startPoint.x, x), // Calculate x for rectangle
      y: Math.min(startPoint.y, y), // Calculate y for rectangle
      width: Math.abs(startPoint.x - x), // Calculate width
      height: Math.abs(startPoint.y - y), // Calculate height
    });
  };

  const handleMouseUp = () => {
    setIsDrawing(false); // End drawing
  };

  return (
    <>
      <Rect
        x={rect ? rect.x : 0} // Use calculated x or default to 0
        y={rect ? rect.y : 0} // Use calculated y or default to 0
        width={rect ? rect.width : 0} // Use calculated width or default to 0
        height={rect ? rect.height : 0} // Use calculated height or default to 0
        fill='red'
        draggable={false} // Disable dragging for drawn rectangles
        onMouseDown={handleMouseDown} // Handle mouse down event
        onMouseMove={handleMouseMove} // Handle mouse move event
        onMouseUp={handleMouseUp} // Handle mouse up event
      />
    </>
  );
};

export default Rectangle;
