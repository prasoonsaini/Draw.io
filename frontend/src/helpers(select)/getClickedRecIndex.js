const getClickedRecIndex = (mouseX, mouseY, allshapes) => {
  for (let i = 0; i < allshapes.length; i++) {
    if (allshapes[i].shape != 'rec' && allshapes[i].shape != 'image')
      continue;
    const rec = allshapes[i];
    if (rec.width < 0) {
      rec.x = rec.x + rec.width;
      rec.width *= -1
    }
    if (rec.height < 0) {
      rec.y = rec.y + rec.height;
      rec.height *= -1
    }
    if (mouseX >= rec.x - 10 && mouseX <= rec.x + rec.width + 10 && mouseY >= rec.y - 10 && mouseY < rec.y + rec.height + 10)
      return i;
  }
  return -1
}

export default getClickedRecIndex;

