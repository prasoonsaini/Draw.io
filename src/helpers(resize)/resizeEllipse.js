function resizeEllipse(sh, centerX, centerY, width, height, mouseX, mouseY, corner) {
    if(corner === 1 || corner === 2 || corner === 3 || corner === 4)
    return {...sh, width: 2*(mouseX-centerX), height: 2*(mouseY-centerY)}
    else if(corner === 5 || corner === 6)
    return {...sh, height: 2*(mouseY-centerY)}
    else if(corner === 7 || corner === 8)
    return {...sh, width: 2*(mouseX-centerX)}
  }
  
  export default resizeEllipse;
  