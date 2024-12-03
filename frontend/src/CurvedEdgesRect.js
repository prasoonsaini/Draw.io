import rough from 'roughjs/bin/rough';

function CurvedRectangle(canvasRef, x, y, width, height, strokeColor,
    backgroundColor, fillType, strokeWidth, slopiness, strokeStyle) {
    if (height < 0) {
        y += height;
        height *= -1;
    }
    if (width < 0) {
        x += width;
        width *= -1
    }
    // console.log("curved rectangle", x, y, width, height)
    const curveRadius = Math.min(width, height) * 0.2;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rc = rough.canvas(canvas);

    rc.path(`M ${x + curveRadius} ${y} 
    L ${x + width - curveRadius} ${y} 
    Q ${x + width} ${y}, ${x + width} ${y + curveRadius} 
    L ${x + width} ${y + height - curveRadius} 
    Q ${x + width} ${y + height}, ${x + width - curveRadius} ${y + height} 
    L ${x + curveRadius} ${y + height} 
    Q ${x} ${y + height}, ${x} ${y + height - curveRadius} 
    L ${x} ${y + curveRadius} 
    Q ${x} ${y}, ${x + curveRadius} ${y}`, {
        disableMultiStroke: false,
        fill: backgroundColor,
        fillStyle: fillType,
        fillWeight: strokeWidth,
        // hachureGap: 4,
        roughness: slopiness,
        seed: 2142156371,
        stroke: strokeColor,
        strokeLineDash: strokeStyle,
        strokeWidth: strokeWidth
    });
}

export default CurvedRectangle;