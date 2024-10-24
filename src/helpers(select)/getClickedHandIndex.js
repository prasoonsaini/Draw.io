import distanceToLine from "./distanceToLine";

const getClickedHandIndex = (mouseX,mouseY,allshapes) => {
    for (let i = 0; i < allshapes.length; i++) {
      const hand = allshapes[i];
      const tolerance = 10
      if(hand.shape!='hand')
      continue;
      const points = hand.points
      // console.log("rdrd",i)
      for(let j=0;j<points.length-1;j++) {
        const distance = distanceToLine(mouseX, mouseY, points[j].x, points[j].y, points[j+1].x, points[j+1].y);
        if (distance <= tolerance) {
          return i;
        }
      }
    }
    return -1
}

export default getClickedHandIndex;