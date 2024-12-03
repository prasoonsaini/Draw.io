const getClickedTextIndex = (mouseX, mouseY, allshapes, ctx) => {
  if (!allshapes)
    return -1;
  for (let i = 0; i < allshapes.length; i++) {
    const sh = allshapes[i];
    if (sh.shape != 'text')
      continue;
    const shape = {
      x: sh.x,
      y: sh.y,
      width: sh.width,
      height: sh.height
    }
    if (mouseX >= shape.x && mouseX <= shape.x + shape.width && mouseY >= shape.y
      && mouseY <= shape.y + shape.height) {
      console.log("shape found", i)
      return i;
    }
  };
  console.log("no shape found")
  return -1;
}

export default getClickedTextIndex;