import React, { useRef, useState, useEffect } from 'react';
import rough from 'roughjs';
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

async function handleSelectDown(canvasRef, e, currentShape, setCurrentShape, setIsDragging, setDraggingIndex, setStartPos,
  allshapes, setAllshapes, isResizing, setIsResizing, setResizingIndex, resizingIndex, corner, setCorner, shape, setPanning,
  offsetX, offsetY, zoomLevel, setCustomiser, setCustom, user) {

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
            getClickedTextIndex(mouseX, mouseY, allshapes, ctx))
        )
      )
    )
  );
  //console.log("index", shapeIndex)
  if (shapeIndex >= 0) {
    setCustomiser(true)
    const current_shape = allshapes[shapeIndex];
    const current_shape_Active = { ...current_shape, current: true }
    console.log("current shape", current_shape);
    const remaining = allshapes.filter((_, index) => index !== shapeIndex); // Correctly filter by index
    const remaining_inactive = remaining.map((shape) => {
      return { ...shape, current: false }
    })

    // set custom according to the shape selected
    console.log("adtive shape----", current_shape_Active)
    const temp_custom = {
      stroke: current_shape_Active.strokeColor,
      background: current_shape_Active.backgroundColor,
      fill: current_shape_Active.fillType,
      strokeWidth: current_shape_Active.strokeWidth,
      strokeStyle: current_shape_Active.strokeStyle,
      slopiness: current_shape_Active.slopiness,
      curved: current_shape_Active.curved,
      font: current_shape_Active.textFont,
      fontSize: current_shape_Active.fontSize
    }
    setCustom(temp_custom)
    const temp = [...remaining_inactive, current_shape_Active];
    setAllshapes(temp);

    const resizeIndex = Math.max(getResizingRecIndex({ mouseX, mouseY, allshapes, corner, setCorner }),
      Math.max(getResizingEllipseIndex({ canvasRef, mouseX, mouseY, allshapes, corner, setCorner }),
        Math.max(getResizingArrowIndex({ canvasRef, mouseX, mouseY, allshapes, corner, setCorner }),
          getResizingTextIndex({ canvasRef, mouseX, mouseY, allshapes, corner, setCorner, offsetX, offsetY, zoomLevel, ctx }))))
    //console.log("resize index", resizeIndex)
    if (resizeIndex != -1) {
      setIsResizing(true)
      setResizingIndex(resizeIndex)
    }
    else {
      setIsDragging(true);
      setDraggingIndex(allshapes.length - 1);
      console.log("shapIndex", shapeIndex)
      setStartPos({ x: mouseX, y: mouseY });
    }
  }
  else {
    const temp = allshapes.map((shape, index) => {
      return { ...shape, current: false };
    });
    setCustomiser(false)
    setAllshapes(temp);
  }
  // if(resizingIndex!=-1 && getResizingRecIndex({mouseX,mouseY,allshapes,corner,setCorner})){
  //   //console.log(corner)
  // }
}

export default handleSelectDown;
