import React, { useRef, useState, useEffect } from 'react';
import rough from 'roughjs/bin/rough';
import ArrowNearShape from '../helpers(select)/ArrowNearShape';

const handleMouseDown = (canvasRef, e, allshapes, setAllshapes, setIsDrawing, setCurrentShape, shape, setShape, offsetX, offsetY, zoomLevel, custom) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    let mouseX = (e.clientX - rect.left) / zoomLevel + offsetX;
    let mouseY = (e.clientY - rect.top) / zoomLevel + offsetY;

    // Start drawing a new rectangle
    setIsDrawing(true)
    // let strokeStyle = [0,0];
    // if(custom.strokeStyle === 'PlaneLine'){

    // }
    if (shape === 'rec') {
        setCurrentShape({
            shape: 'rec', x: mouseX, y: mouseY, width: 0, height: 0, current: true, strokeColor: custom.stroke, backgroundColor: custom.background,
            fillType: custom.fill, strokeWidth: custom.strokeWidth, slopiness: custom.slopiness, strokeStyle: custom.strokeStyle, curved: custom.curved,
            seed: Math.floor(Math.random() * 1000)
        });
    }
    else if (shape === 'cir') {
        setCurrentShape({
            shape: 'cir', x: mouseX, y: mouseY, diameter: 0, current: true, strokeColor: custom.stroke,
            backgroundColor: custom.background, fillType: custom.fill, strokeWidth: custom.strokeWidth, slopiness: custom.slopiness, strokeStyle: custom.strokeStyle,
            seed: Math.floor(Math.random() * 1000)
        });
    }
    else if (shape === "line") {
        const arrowId = Math.floor(Math.random() * 100000);
        setCurrentShape({
            shape: 'line', startX: mouseX, startY: mouseY, endX: mouseX, endY: mouseY, current: true,
            strokeColor: custom.stroke, strokeWidth: custom.strokeWidth, slopiness: custom.slopiness, strokeStyle: custom.strokeStyle,
            ArrowHeadRef: [], ArrowLegRef: [], shapeId: arrowId,
            seed: Math.floor(Math.random() * 1000)
        });
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
        setCurrentShape({
            shape: 'hand', points: [{ x: mouseX, y: mouseY }, { x: mouseX, y: mouseY }],
            current: true, strokeColor: custom.stroke, strokeWidth: custom.strokeWidth, slopiness: custom.slopiness, strokeStyle: custom.strokeStyle,
            seed: Math.floor(Math.random() * 1000)
        });
    }
    else if (shape === "ellipse") {
        setCurrentShape({
            shape: 'ellipse', x: mouseX, y: mouseY, width: 0, height: 0, current: true, strokeColor: custom.stroke, backgroundColor: custom.background, fillType: custom.fill,
            strokeWidth: custom.strokeWidth, slopiness: custom.slopiness, strokeStyle: custom.strokeStyle,
            seed: Math.floor(Math.random() * 1000)
        });
    }
};


export default handleMouseDown;