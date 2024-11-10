

const handleMouseDownPanning = (e,setIsPanDragging,setStartX,setStartY,offsetX,offsetY) => {
    setIsPanDragging(true);
    setStartX(e.clientX + offsetX);
    setStartY(e.clientY + offsetY);
  };

export default handleMouseDownPanning;