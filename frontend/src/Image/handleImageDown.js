
const handleImageDown = (canvasRef, e, setIsDragging, setDraggingIndex, allshapes, setAllshapes, offsetX, offsetY, zoomLevel) => {
    const { clientX, clientY } = e;
    const canvasX = (clientX - offsetX) / zoomLevel;
    const canvasY = (clientY - offsetY) / zoomLevel;

    // Check if any image is clicked
    const clickedIndex = allshapes.findIndex(
        (shape) =>
            shape.type === "image" &&
            canvasX >= shape.x &&
            canvasX <= shape.x + shape.width &&
            canvasY >= shape.y &&
            canvasY <= shape.y + shape.height
    );

    if (clickedIndex !== -1) {
        setIsDragging(true);
        setDraggingIndex(clickedIndex);
    }
};


export default handleImageDown;