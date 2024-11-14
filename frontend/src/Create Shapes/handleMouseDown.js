import React, { useRef, useState, useEffect } from 'react';
import rough from 'roughjs/bin/rough';

const handleMouseDown = (canvasRef, e, setIsDrawing, setCurrentShape, shape, setShape, offsetX, offsetY, zoomLevel) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    let mouseX = (e.clientX - rect.left) / zoomLevel + offsetX;
    let mouseY = (e.clientY - rect.top) / zoomLevel + offsetY;

    // Start drawing a new rectangle
    setIsDrawing(true)
    if (shape === 'rec') {
        setCurrentShape({ shape: 'rec', x: mouseX, y: mouseY, width: 0, height: 0, current: true, strokeColor: '#e03131', backgroundColor: 'white', fillType: 'solid', strokeWidth: 1, slopiness: 0.5, strokeStyle: [0, 0] });
    }
    else if (shape === 'cir') {
        setCurrentShape({ shape: 'cir', x: mouseX, y: mouseY, diameter: 0, current: true, strokeColor: '#e03131', backgroundColor: 'white', fillType: 'solid', strokeWidth: 2, slopiness: 0, strokeStyle: [0, 0] });
    }
    else if (shape === "line") {
        setCurrentShape({ shape: 'line', startX: mouseX, startY: mouseY, endX: mouseX, endY: mouseY, current: true, strokeColor: '#e03131', strokeWidth: 2, slopiness: 0, strokeStyle: [0, 0] });
    }
    else if (shape === "hand") {
        setCurrentShape({ shape: 'hand', points: [{ x: mouseX, y: mouseY }, { x: mouseX, y: mouseY }], current: true, strokeColor: '#e03131', strokeWidth: 2, slopiness: 0, strokeStyle: [0, 0] });
    }
    else if (shape === "ellipse") {
        setCurrentShape({ shape: 'ellipse', x: mouseX, y: mouseY, width: 0, height: 0, strokeColor: '#e03131', backgroundColor: 'white', fillType: 'solid', strokeWidth: 2, slopiness: 0, strokeStyle: [0, 0] });
    }
};


export default handleMouseDown;