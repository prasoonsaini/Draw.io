import distanceToLine from "./distanceToLine";

const getClickedArrowIndex = (mouseX, mouseY, allshapes) => {
    // Check if the mouse click is near any of the arrows
    const tolerance = 10; // Distance from the line that counts as a click

    for (let i = 0; i < allshapes.length; i++) {
      if(allshapes[i].shape!='line')
      continue;
      const arrow = allshapes[i];
      const distance = distanceToLine(mouseX, mouseY, arrow.startX, arrow.startY, arrow.endX, arrow.endY);
      if (distance <= tolerance) {
        return i;
      }
    }
    return -1;
  };

export default getClickedArrowIndex;