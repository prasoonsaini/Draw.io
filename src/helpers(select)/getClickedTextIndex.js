const getClickedTextIndex = (mouseX, mouseY, allshapes) => {
  if (!allshapes)
    return -1;
  for (let i = 0; i < allshapes.length; i++) {
    const shape = allshapes[i];
    //console.log(shape)
    if (shape.shape != 'text')
      continue;
    if (mouseX >= shape.borderX && mouseX <= shape.borderX + shape.borderWidth && mouseY >= shape.borderY && mouseY <= shape.borderY + shape.borderHeight)
      return i;
  }
  return -1;
};

export default getClickedTextIndex;