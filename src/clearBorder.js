import rough from 'roughjs/bin/rough';

function clearAndBorder(canvasRef,allshapes) {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext('2d');
  const roughCanvas = rough.canvas(canvas);

  // Clear the canvas before redrawing
  ctx.clearRect(0, 0, canvas.width, canvas.height);

   // Redraw all shapes without borders
   allshapes.forEach(sh => {
    if(sh && sh.shape === 'rec')
    {
      roughCanvas.rectangle(sh.x, sh.y, sh.width, sh.height, {
        stroke: 'black',
        fillStyle: 'cross-hatch', 
        fillWeight: 1,
        fill: 'red',
        strokeWidth: 2,
        roughness: 1,
        seed: 12345,
        roughness: 1,          // Controls how rough the edges are
        bowing: 1,            // Controls the wobbliness of the lines
        curveStepCount: 1000 
      });
    } 
    if(sh && sh.shape === 'cir')
    {
      roughCanvas.circle(sh.x, sh.y, sh.diameter, {
        stroke: 'black',
        strokeWidth: 1,
        fillStyle: 'dots',
        fill: 'green',
        fillWeight: 1,
        roughness: 1,
        seed: 12345
      });
    } 
    if(sh && sh.shape === 'line') {
      roughCanvas.line(sh.startX, sh.startY, sh.endX, sh.endY,{
        seed: 12345
      });
      const arrowHeadLength = 20;
      const angle = Math.atan2(sh.endY - sh.startY, sh.endX - sh.startX);

      // Left part of the arrowhead
      roughCanvas.line(
        sh.endX,
        sh.endY,
        sh.endX - arrowHeadLength * Math.cos(angle - Math.PI / 6),
        sh.endY - arrowHeadLength * Math.sin(angle - Math.PI / 6),
        {seed: 12345}
      );

      // Right part of the arrowhead
      roughCanvas.line(
        sh.endX,
        sh.endY,
        sh.endX - arrowHeadLength * Math.cos(angle + Math.PI / 6),
        sh.endY - arrowHeadLength * Math.sin(angle + Math.PI / 6),
        {seed: 12345}
      );
    };
    if(sh && sh.shape === 'hand') {
      const points = sh.points
      for(let i=0;i<points.length-1;i++)
      {
        roughCanvas.line(points[i].x,points[i].y,points[i+1].x,points[i+1].y,{
          stroke: "black",
          strokeWidth: 1,
          seed: 12345
        });
      }
    }
  })

}


export default clearAndBorder;




