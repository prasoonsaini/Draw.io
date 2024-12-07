import React, { useRef, useState, useEffect } from "react";
import getClickedTextIndex from "../../helpers(select)/getClickedTextIndex";
import updateText from "./updateText";

const handleDoubleClick = (canvasRef, e, currentShape, setCurrentShape, shape, setShape, allshapes, setAllshapes,
    font, setFont, offsetX, offsetY, zoomLevel, user, custom, setSelected) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    // Get the bounding rectangle of the canvas
    let mouseX = (e.clientX - rect.left);
    let mouseY = (e.clientY - rect.top);
    const clickedIdx = getClickedTextIndex(mouseX, mouseY, allshapes, ctx);

    if (clickedIdx == -1)
        return;

    setSelected("text")
    console.log(":set is selected")
    const updateShape = allshapes[clickedIdx];
    console.log("thiis the text shape", updateShape)
    const restShapes = allshapes.filter((sh) => {
        if (sh.shapeId !== updateShape.shapeId) {
            return true;
        }
    })
    setAllshapes([...restShapes])
    updateText(canvasRef, e, currentShape, setCurrentShape, shape, setShape, allshapes, setAllshapes,
        font, setFont, offsetX, offsetY, zoomLevel, user, updateShape, custom)


};

export default handleDoubleClick;
