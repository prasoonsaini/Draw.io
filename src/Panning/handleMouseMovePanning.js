
const handleMouseMovePanning = (e,isPanDragging,setOffsetX,setOffsetY,startX,startY) => {
    if (isPanDragging) {
      // Update the offsets as the user drags the canvas
      setOffsetX((startX - e.clientX));
      setOffsetY((startY - e.clientY));
    }
  };

export default handleMouseMovePanning;