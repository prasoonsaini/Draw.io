import React, { useRef, useState, useEffect } from 'react';
import rough from 'roughjs/bin/rough';
import ArrowNearShape from '../helpers(select)/ArrowNearShape';

const handleMouseDown = (canvasRef, e, allshapes, setAllshapes, setIsDrawing, setCurrentShape, shape, setShape, offsetX, offsetY, zoomLevel) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    let mouseX = (e.clientX - rect.left) / zoomLevel + offsetX;
    let mouseY = (e.clientY - rect.top) / zoomLevel + offsetY;

    // Start drawing a new rectangle
    setIsDrawing(true)
    if (shape === 'rec') {
        setCurrentShape({ shape: 'rec', x: mouseX, y: mouseY, width: 0, height: 0, current: true, strokeColor: 'black', backgroundColor: 'transparent', fillType: 'solid', strokeWidth: 1, slopiness: 0.5, strokeStyle: [0, 0], curved: true });
    }
    else if (shape === 'cir') {
        setCurrentShape({ shape: 'cir', x: mouseX, y: mouseY, diameter: 0, current: true, strokeColor: 'black', backgroundColor: 'white', fillType: 'solid', strokeWidth: 2, slopiness: 0, strokeStyle: [0, 0] });
    }
    else if (shape === "line") {
        const arrowId = Math.floor(Math.random() * 100000);
        setCurrentShape({ shape: 'line', startX: mouseX, startY: mouseY, endX: mouseX, endY: mouseY, current: true, strokeColor: 'black', strokeWidth: 2, slopiness: 0, strokeStyle: [0, 0], ArrowHeadRef: [], ArrowLegRef: [], shapeId: arrowId });
        const leg_shapeId = ArrowNearShape(mouseX, mouseY, allshapes);
        if (leg_shapeId > 0) {
            console.log("arrow leg found", leg_shapeId);

            const updatedShapes = allshapes.map((shape) => {
                if (shape.shapeId === leg_shapeId) {
                    // Clone the shape and update its ArrowLegRef
                    return {
                        ...shape,
                        ArrowLegRef: [...(shape.ArrowLegRef || []), { arrowRef: arrowId }] // Ensure ArrowHeadRef is an array
                    };
                }
                return shape; // Return the shape as is if not matching
            });

            console.log("Updated shapes", updatedShapes);
            setAllshapes(updatedShapes);

            console.log("arrow leg found", updatedShapes);
            // Add your PUT logic here if needed
        }
    }
    else if (shape === "hand") {
        setCurrentShape({ shape: 'hand', points: [{ x: mouseX, y: mouseY }, { x: mouseX, y: mouseY }], current: true, strokeColor: 'black', strokeWidth: 2, slopiness: 0, strokeStyle: [0, 0] });
    }
    else if (shape === "ellipse") {
        setCurrentShape({ shape: 'ellipse', x: mouseX, y: mouseY, width: 0, height: 0, current: true, strokeColor: 'black', backgroundColor: 'white', fillType: 'solid', strokeWidth: 2, slopiness: 0, strokeStyle: [0, 0] });
    }
};


export default handleMouseDown;