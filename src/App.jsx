import React, { useState } from 'react';
import { Stage, Layer, Rect } from 'react-konva';

const App = () => {
  const [rectangles, setRectangles] = useState([]); // Store all drawn rectangles
  const [newRect, setNewRect] = useState(null); // Current rectangle being drawn
  const [isDrawing, setIsDrawing] = useState(false); // Whether the user is drawing
  const [isDragging, setIsDragging] = useState(false); // Track if the user is dragging

  const handleMouseDown = (e) => {
    // If dragging a rectangle, don't initiate a new drawing
    if (e.target.getClassName() === 'Rect') {
      setIsDragging(true);
      return;
    }
    
    const { x, y } = e.target.getStage().getPointerPosition();
    setNewRect({ x, y, width: 0, height: 0 }); // Start new rectangle
    setIsDrawing(true); // Begin drawing mode
  };

  const handleMouseMove = (e) => {
    // Only update the rectangle size if currently drawing and not dragging
    if (!isDrawing || isDragging) return;

    const { x, y } = e.target.getStage().getPointerPosition();
    const width = x - newRect.x;
    const height = y - newRect.y;

    // Update the current rectangle's width and height
    setNewRect((prevRect) => ({
      ...prevRect,
      width,
      height,
    }));
  };

  const handleMouseUp = () => {
    // If a rectangle was dragged, stop the dragging mode
    if (isDragging) {
      setIsDragging(false);
      return;
    }

    // Finalize the rectangle if drawing
    if (newRect) {
      setRectangles([...rectangles, newRect]);
      setNewRect(null); // Reset the temporary rectangle
    }
    setIsDrawing(false); // End drawing mode
  };

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={handleMouseDown} // Capture events on the Stage
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ border: '1px solid black' }}
    >
      <Layer>
        {rectangles.map((rect, i) => (
          <Rect
            key={i}
            x={rect.x}
            y={rect.y}
            width={rect.width}
            height={rect.height}
            stroke="black" // Only stroke, no fill
            strokeWidth={2} // Set border thickness
            draggable
            onDragStart={() => setIsDragging(true)} // Track when dragging starts
            onDragEnd={() => setIsDragging(false)} // Reset after dragging ends
          />
        ))}
        {newRect && (
          <Rect
            x={newRect.x}
            y={newRect.y}
            width={newRect.width}
            height={newRect.height}
            stroke="black" // Only stroke, no fill
            strokeWidth={2} // Set border thickness
          />
        )}
      </Layer>
    </Stage>
  );
};

export default App;
