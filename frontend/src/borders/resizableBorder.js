import rough from 'roughjs';
function resizeBorder({ canvasRef, x, y, width, height }) {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const roughCanvas = rough.canvas(canvas);
    roughCanvas.rectangle(x, y, width, height, { roughness: 0, strokeWidth: 0.5, stroke: "blue" });
    roughCanvas.rectangle(x - 5, y - 5, 10, 10, { roughness: 0, strokeWidth: 0.5, fill: 'white', fillStyle: 'solid', stroke: "blue" });
    roughCanvas.rectangle(x + width - 5, y - 5, 10, 10, { roughness: 0, strokeWidth: 0.5, fill: 'white', fillStyle: 'solid', stroke: "blue" });
    roughCanvas.rectangle(x - 5, y + height - 5, 10, 10, { roughness: 0, strokeWidth: 0.5, fill: 'white', fillStyle: 'solid', stroke: "blue" });
    roughCanvas.rectangle(x + width - 5, y + height - 5, 10, 10, { roughness: 0, strokeWidth: 0.5, fill: 'white', fillStyle: 'solid', stroke: "blue" });

    roughCanvas.rectangle(x + width / 2 - 5, y - 5, 10, 10, { roughness: 0, strokeWidth: 0.5, fill: 'white', fillStyle: 'solid', stroke: "blue" });
    roughCanvas.rectangle(x - 5, y + height / 2 - 5, 10, 10, { roughness: 0, strokeWidth: 0.5, fill: 'white', fillStyle: 'solid', stroke: "blue" });
    roughCanvas.rectangle(x + width / 2 - 5, y + height - 5, 10, 10, { roughness: 0, strokeWidth: 0.5, fill: 'white', fillStyle: 'solid', stroke: "blue" });
    roughCanvas.rectangle(x + width - 5, y + height / 2 - 5, 10, 10, { roughness: 0, strokeWidth: 0.5, fill: 'white', fillStyle: 'solid', stroke: "blue" });
}

export default resizeBorder;