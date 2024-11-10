const getClickedEllipseIndex = (mouseX, mouseY, allshapes) => {
    for (let i = 0; i < allshapes.length; i++) {
      if(allshapes[i].shape!='ellipse')
      continue;
      const elli = allshapes[i];
    //   console.log(mouseX,mouseY,elli.x,elli.y,elli.width,elli.height)
      const eq = ((mouseX-elli.x)*(mouseX-elli.x))/((elli.width/2)*(elli.width/2))+((mouseY-elli.y)*(mouseY-elli.y))/((elli.height/2)*(elli.height/2))
      if(eq>=0.7 & eq<=2.2)
      return i;
    }
    return -1
}

export default getClickedEllipseIndex