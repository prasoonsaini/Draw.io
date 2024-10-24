function getResizingTextIndex({ mouseX, mouseY, allshapes, setCorner, offsetX, offsetY, zoomLevel }) {
  for (let i = 0; i < allshapes.length; i++) {
    const sh = allshapes[i];
    if (sh.shape === 'text') {
      const shape = {
        x: sh.borderX,
        y: sh.borderY,
        width: sh.borderWidth,
        height: sh.borderHeight
      }
      // console.log("resize",mouseX,mouseY)
      console.log("insdie click", shape)
      console.log(mouseX, mouseY)
      if (Math.abs(mouseX - shape.x - shape.width) <= 10 && Math.abs(mouseY - shape.y - shape.height) <= 10) {
        console.log("inside 4th corner")
        setCorner(prevCorner => {
          const newCorner = 4;
          console.log("corner", newCorner);
          return newCorner;
        });
        return i;
      }
    }
  }
  return -1;
}

export default getResizingTextIndex;

