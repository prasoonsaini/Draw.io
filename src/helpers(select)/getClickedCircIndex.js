const getClickedCircIndex = (mouseX, mouseY, allshapes) => {
    for (let i = 0; i < allshapes.length; i++) {
      if(allshapes[i].shape!='cir')
      continue;
      const cir = allshapes[i];
      const dist = Math.sqrt((cir.x-mouseX)*(cir.x-mouseX)+(cir.y-mouseY)*(cir.y-mouseY))
      if(dist<=cir.diameter/2)
      return i;
    }
    return -1
}

export default getClickedCircIndex