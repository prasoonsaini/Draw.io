import React, { useRef, useState, useEffect } from 'react';
import rough from 'roughjs/bin/rough';

const handleMouseMove = (canvasRef, e, isDrawing, currentShape, setCurrentShape, shape, offsetX, offsetY, zoomLevel) => {
  const canvas = canvasRef.current;
  const rect = canvas.getBoundingClientRect();
  let mouseX = (e.clientX - rect.left) / zoomLevel + offsetX;
  let mouseY = (e.clientY - rect.top) / zoomLevel + offsetY;

  if (isDrawing && currentShape) {
    // Update the size of the rectangle as the mouse moves
    if (shape === 'rec') {
      setCurrentShape(prevRect => ({
        ...prevRect,
        width: mouseX - prevRect.x,
        height: mouseY - prevRect.y,
      }));
    }
    else if (shape === 'cir') {
      setCurrentShape(prevCirc => ({
        ...prevCirc,
        diameter: mouseX - prevCirc.x,
      }));
    }
    else if (shape === 'line') {
      setCurrentShape(prevLine => ({
        ...prevLine,
        endX: mouseX,
        endY: mouseY,
      }))
    }
    else if (shape === 'hand') {
      const lastPoint = currentShape.points[currentShape.points.length - 1];

      // Only add the point if it's a significant distance from the last point to avoid unnecessary draws
      if (!lastPoint || Math.hypot(mouseX - lastPoint.x, mouseY - lastPoint.y) > 5) {
        // Create a new points array with the new point
        const newPoints = [...currentShape.points, { x: mouseX, y: mouseY }];

        // Update the current shape with the new points array
        setCurrentShape(prevHand => ({
          ...prevHand,
          points: newPoints,
        }));
      }
    }

    else if (shape === 'ellipse') {
      setCurrentShape(prevShape => ({
        ...prevShape,
        width: 2 * (mouseX - prevShape.x),
        height: 2 * (mouseY - prevShape.y)
      }))
    }
  }
};

export default handleMouseMove;