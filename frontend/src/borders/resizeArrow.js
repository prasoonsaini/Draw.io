import rough from 'roughjs/bin/rough';
function resizeArrow({canvasRef,startX,startY,endX,endY}){
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const roughCanvas = rough.canvas(canvas);
    roughCanvas.circle(startX,startY,10,{
        roughness:0, strokeWidth: 1,fill: 'white', fillStyle:'solid', stroke:"blue"
    })
    roughCanvas.circle(endX,endY,10,{
        roughness:0, strokeWidth: 1,fill: 'white', fillStyle:'solid', stroke:"blue"
    })
}

export default resizeArrow;