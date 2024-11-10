

function resizeRectangle(sh,endx,endy,mouseX,mouseY,corner){
    if(corner === 4){
       return {...sh, font: `${mouseX-sh.x}px Arial`,}
    }
}

export default resizeRectangle;