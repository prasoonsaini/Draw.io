

function resizeRectangle(sh,endx,endy,mouseX,mouseY,corner){
    if(corner === 4){
        // console.log("corner is one ")
       return {...sh, width: mouseX-sh.x, height: mouseY-sh.y}
       }
       else if(corner === 1){
        return {...sh, x: mouseX, y: mouseY, width: endx-mouseX, height: endy-mouseY}
       }
       else if(corner === 3){
        return {...sh,y: mouseY, width: mouseX-sh.x, height: (sh.y+sh.height)-mouseY}
       }
       else if(corner === 2){
        return {...sh, x: mouseX, width: endx-mouseX, height: mouseY-sh.y}
       }
       else if(corner === 5){
        return {...sh, y: mouseY, height: sh.height + sh.y-mouseY}
       }
       else if(corner === 6){
        return {...sh, height: mouseY-sh.y}
       }
       else if(corner === 7){
        return {...sh, x: mouseX, width: sh.width + sh.x-mouseX}
       }
       else if(corner === 8){
        return {...sh, width: mouseX-sh.x}
       }
}

export default resizeRectangle;