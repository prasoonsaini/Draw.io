import React, { useRef, useState, useEffect } from 'react';
import rough from 'roughjs/bin/rough';
import getClickedRecIndex from '../helpers(select)/getClickedRecIndex';
import getClickedCircIndex from '../helpers(select)/getClickedCircIndex';
import getClickedArrowIndex from '../helpers(select)/getClickedArrowIndex';
import getClickedHandIndex from '../helpers(select)/getClickedHandIndex';
import resizeBorder from '../borders/resizableBorder';
import getResizingRecIndex from '../helpers(resize)/getResizingRecIndex';
import getClickedEllipseIndex from '../helpers(select)/getClickedElipseIndex';
import getResizingEllipseIndex from '../helpers(resize)/getResizingEllipseIndex';
import getResizingArrowIndex from '../helpers(resize)/getResizingArrowIndex';
import getClickedTextIndex from '../helpers(select)/getClickedTextIndex';
import getResizingTextIndex from '../helpers(resize)/getResizingTextIndex';

function handleSelectDown(canvasRef, e, currentShape, setCurrentShape, setIsDragging, setDraggingIndex, setStartPos,
  allshapes, setAllshapes, isResizing, setIsResizing, setResizingIndex, resizingIndex, corner, setCorner, shape, setPanning,
  offsetX, offsetY, zoomLevel) {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext('2d');
  const roughCanvas = rough.canvas(canvas);

  const rect = canvas.getBoundingClientRect();
  let mouseX = (e.clientX - rect.left) / zoomLevel + offsetX;
  let mouseY = (e.clientY - rect.top) / zoomLevel + offsetY;

  //console.log(offsetX, offsetY)
  // Check if the user is clicking inside an existing shape for dragging
  let shapeIndex = -1;
  shapeIndex = Math.max(
    getClickedRecIndex(mouseX, mouseY, allshapes),
    Math.max(
      getClickedCircIndex(mouseX, mouseY, allshapes),
      Math.max(
        getClickedArrowIndex(mouseX, mouseY, allshapes),
        Math.max(getClickedHandIndex(mouseX, mouseY, allshapes),
          Math.max(getClickedEllipseIndex(mouseX, mouseY, allshapes),
            getClickedTextIndex(mouseX, mouseY, allshapes))
        )
      )
    )
  );
  //console.log("index", shapeIndex)
  if (shapeIndex >= 0) {
    // Add a border to the selected shape
    const temp = allshapes.map((shape, index) => {
      // Update the clicked shape's `current` property to true, others to false
      if (index === shapeIndex) {
        return { ...shape, current: true };
      }
      return { ...shape, current: false };
    });
    setAllshapes(temp);  // Add this if it's missing

    const resizeIndex = Math.max(getResizingRecIndex({ mouseX, mouseY, allshapes, corner, setCorner }),
      Math.max(getResizingEllipseIndex({ canvasRef, mouseX, mouseY, allshapes, corner, setCorner }),
        Math.max(getResizingArrowIndex({ canvasRef, mouseX, mouseY, allshapes, corner, setCorner }),
          getResizingTextIndex({ canvasRef, mouseX, mouseY, allshapes, corner, setCorner, offsetX, offsetY, zoomLevel }))))
    //console.log("resize index", resizeIndex)
    if (resizeIndex != -1) {
      setIsResizing(true)
      setResizingIndex(resizeIndex)
    }
    else {
      setIsDragging(true);
      setDraggingIndex(shapeIndex);
      setStartPos({ x: mouseX, y: mouseY });
    }
  }
  else {
    const temp = allshapes.map((shape, index) => {
      return { ...shape, current: false };
    });
    setAllshapes(temp);
  }
  // if(resizingIndex!=-1 && getResizingRecIndex({mouseX,mouseY,allshapes,corner,setCorner})){
  //   //console.log(corner)
  // }
}

export default handleSelectDown;
