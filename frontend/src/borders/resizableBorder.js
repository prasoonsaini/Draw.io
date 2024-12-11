import rough from 'roughjs';

function resizeBorder({ canvasRef, x, y, width, height }) {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const roughCanvas = rough.canvas(canvas);

    // Draw the main rectangle
    roughCanvas.rectangle(x, y, width, height, { roughness: 0, strokeWidth: 0.5, stroke: "blue" });
    // Draw the resize handles (corners and edges)
    const handles = [
        { x: x - 5, y: y - 5 }, // Top-left
        { x: x + width - 5, y: y - 5 }, // Top-right
        { x: x - 5, y: y + height - 5 }, // Bottom-left
        { x: x + width - 5, y: y + height - 5 }, // Bottom-right
        { x: x + width / 2 - 5, y: y - 5 }, // Top-center
        { x: x - 5, y: y + height / 2 - 5 }, // Left-center
        { x: x + width / 2 - 5, y: y + height - 5 }, // Bottom-center
        { x: x + width - 5, y: y + height / 2 - 5 }, // Right-center
    ];

    handles.forEach(handle => {
        roughCanvas.rectangle(handle.x, handle.y, 10, 10, {
            roughness: 0,
            strokeWidth: 0.5,
            fill: 'white',
            fillStyle: 'solid',
            stroke: "blue",
        });
    });

    // Add event listener for cursor change
    canvas.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        // Check if the mouse is near any handle
        let cursorStyle = 'default';
        for (let i = 0; i < handles.length; i++) {
            const handle = handles[i];
            if (
                (mouseX >= handle.x &&
                    mouseX <= handle.x + 10 &&
                    mouseY >= handle.y &&
                    mouseY <= handle.y + 10)
            ) {
                if (i < 4) {
                    // Corners: Use diagonal resize cursors
                    cursorStyle = i === 0 || i === 3 ? 'nwse-resize' : 'nesw-resize';
                } else {
                    // Edges: Use vertical or horizontal resize cursors
                    cursorStyle = i % 2 === 0 ? 'ns-resize' : 'ew-resize';
                }
                break;
            }
        }

        // Update cursor
        canvas.style.cursor = cursorStyle;
    });
}

export default resizeBorder;
