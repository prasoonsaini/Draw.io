import rough from 'roughjs/bin/rough';
function getResizingArrowIndex({canvasRef,mouseX, mouseY, allshapes, setCorner}) {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const roughCanvas = rough.canvas(canvas);

    for(let i=0;i<allshapes.length;i++){
        const shape = allshapes[i]
        if(shape.shape!='line')
        continue;
        if(Math.abs(mouseX-shape.startX)<=10 && Math.abs(mouseY-shape.startY)<=10){
            setCorner(prevCorner => {
                const newCorner = 1;
                console.log("corner",newCorner); // Log the updated value here
                return newCorner;
            });
            return i;
        }
        else if(Math.abs(mouseX-shape.endX)<=10 && Math.abs(mouseY-shape.endY)<=10){
            setCorner(prevCorner => {
                const newCorner = 2;
                console.log("corner",newCorner); // Log the updated value here
                return newCorner;
            });
            return i;
        }
    }
    return -1;
  }

export default getResizingArrowIndex;

  