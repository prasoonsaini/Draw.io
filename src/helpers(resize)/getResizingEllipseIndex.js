import rough from 'roughjs/bin/rough';
function getResizingEllipseIndex({canvasRef,mouseX, mouseY, allshapes, setCorner}) {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const roughCanvas = rough.canvas(canvas);

    for (let i = 0; i < allshapes.length; i++) {
      const sh = allshapes[i];
      const shape = {
        x: sh.x-sh.width/2+5,
        y: sh.y-sh.height/2+5,
        width: sh.width - 10,
        height: sh.height - 10
      }
      if (sh.shape === 'ellipse') {
        if (mouseX >= shape.x - 10 && mouseX <= shape.x + 10 && mouseY >= shape.y - 10 && mouseY <= shape.y + 10) {
          setCorner(prevCorner => {
            const newCorner = 1;
            console.log("corner",newCorner); // Log the updated value here
            return newCorner;
          });
          return i;
        }
        if (mouseY >= shape.y + shape.height && mouseY <= shape.y + shape.height + 10 && mouseX <= shape.x + 10 && mouseX >= shape.x - 10) {
          setCorner(prevCorner => {
            const newCorner = 2;
            console.log("corner",newCorner);
            return newCorner;
          });
          return i;
        }
        if (mouseX >= shape.x + shape.width && mouseX <= shape.x + shape.width + 10 && mouseY <= shape.y + 10 && mouseY >= shape.y - 10) {
          setCorner(prevCorner => {
            const newCorner = 3;
            console.log("corner",newCorner);
            return newCorner;
          });
          return i;
        }
        if (mouseX >= shape.x + shape.width && mouseX <= shape.x + shape.width + 10 && mouseY >= shape.y + shape.height && mouseY <= shape.y + shape.height + 10) {
          setCorner(prevCorner => {
            const newCorner = 4;
            console.log("corner",newCorner);
            return newCorner;
          });
          return i;
        }
        if(mouseX >= shape.x + shape.width/2-5 && mouseX<= shape.x + shape.width/2+5 && mouseY>=shape.y-10 && mouseY<=shape.y){
            setCorner(prevCorner => {
                const newCorner = 5;
                console.log("corner",newCorner);
                return newCorner;
              });
              return i;
        }
        if(mouseX >= shape.x + shape.width/2-5 && mouseX<= shape.x + shape.width/2+5 && mouseY>=shape.y+shape.height && mouseY<=shape.y+shape.height+10){
            setCorner(prevCorner => {
                const newCorner = 6;
                console.log("corner",newCorner);
                return newCorner;
              });
              return i;
        }
        if(mouseX >= shape.x-10 && mouseX<= shape.x && mouseY>=shape.y+shape.height/2-5 && mouseY<=shape.y+shape.height/2+5){
            setCorner(prevCorner => {
                const newCorner = 7;
                console.log("corner",newCorner);
                return newCorner;
              });
              return i;
        }
        if(mouseX >= shape.x+shape.width && mouseX<= shape.x+shape.width+10 && mouseY>=shape.y+shape.height/2-5 && mouseY<=shape.y+shape.height/2+5){
            setCorner(prevCorner => {
                const newCorner = 8;
                console.log("corner",newCorner);
                return newCorner;
              });
              return i;
        }
      }
    }
    return -1;
  }

export default getResizingEllipseIndex

  