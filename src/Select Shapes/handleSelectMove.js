import resizeBorder from "../borders/resizableBorder";
import resizeEllipse from "../helpers(resize)/resizeEllipse";
import resizeRectangle from "../helpers(resize)/resizeRectangle";

function handleSelectMove(canvasRef, e, startPos, draggingIndex, isDragging,
    setStartPos, setAllshapes, isResizing, setIsResizing, resizingIndex, corner, shape, panning, offsetX, offsetY, zoomLevel) {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    let mouseX = (e.clientX - rect.left) / zoomLevel + offsetX;
    let mouseY = (e.clientY - rect.top) / zoomLevel + offsetY;
    //console.log(shape)
    if (isDragging && draggingIndex !== null) {
        const dx = mouseX - startPos.x;
        const dy = mouseY - startPos.y;
        // resizeBorder({canvasRef,x: 7, y: 6, width: 100, height: 100})
        // Update the starting position for the next move
        // Move the dragged rectangle
        setAllshapes(prevShapes =>
            prevShapes.map((sh, index) => {
                if (index === draggingIndex) {
                    if (sh.shape === 'line') {
                        return { ...sh, startX: sh.startX + dx, startY: sh.startY + dy, endX: sh.endX + dx, endY: sh.endY + dy }
                    }
                    else if (sh.shape === 'hand') {
                        const temp = [];
                        let points = sh.points
                        for (let j = 0; j < points.length; j++) {
                            let xx = points[j].x + dx
                            let yy = points[j].y + dy
                            temp.push({ x: xx, y: yy })
                        }
                        return { ...sh, points: temp }
                    }
                    else if (sh.shape === 'text') {
                        return { ...sh, x: sh.x + dx, y: sh.y + dy, borderX: sh.borderX + dx, borderY: sh.borderY + dy }
                    }
                    else {
                        return { ...sh, x: sh.x + dx, y: sh.y + dy }
                    }
                }
                else {
                    return sh
                }
            })
        );
        setStartPos({ x: mouseX, y: mouseY });
    } else if (isResizing && resizingIndex != null) {

        setAllshapes(prevShapes =>
            prevShapes.map((sh, index) => {
                if (index === resizingIndex) {
                    if (sh.shape === 'rec') {
                        const endx = sh.x + sh.width;
                        const endy = sh.y + sh.height;
                        const res = resizeRectangle(sh, endx, endy, mouseX, mouseY, corner)
                        return res
                    }
                    else if (sh.shape === 'ellipse') {
                        const centerX = sh.x;
                        const centerY = sh.y;
                        const res = resizeEllipse(sh, centerX, centerY, sh.width, sh.height, mouseX, mouseY, corner);
                        return res;
                    }
                    else if (sh.shape === 'line') {
                        if (corner === 1)
                            return { ...sh, startX: mouseX, startY: mouseY }
                        else
                            return { ...sh, endX: mouseX, endY: mouseY }
                    }
                    else if (sh.shape === 'text') {
                        const fontSizeScalingFactor = 0.1; // Scaling factor to make font size changes smoother
                        const minFontSize = 30; // Minimum font size to avoid shrinking too much
                        const maxFontSize = 100; // Maximum font size to avoid getting too large
                        if (corner === 4) { // bottom-left corner
                            // Calculate the change in font size based on mouse movement
                            let fontSizeChange = (mouseY - (sh.borderY + sh.borderHeight)) * fontSizeScalingFactor;
                            const newFontSize = Math.max(minFontSize, Math.min(sh.fontSize + fontSizeChange, maxFontSize));

                            // Adjust the width and height of the border based on the new text size
                            const lineHeight = newFontSize; // Line height can be same as font size
                            const textLines = sh.text.split('\n'); // Split into multiple lines if necessary
                            const newBorderHeight = lineHeight * textLines.length; // Adjust border height for all lines

                            // Resize border width to fit the text dynamically
                            const ctx = canvas.getContext('2d');
                            ctx.font = `${newFontSize}px 'Shadows Into Light', cursive`; // Use new font size
                            const newBorderWidth = Math.max(...textLines.map(line => ctx.measureText(line).width)); // Adjust width

                            // Adjust borderY to accommodate the new font size
                            const newBorderY = sh.y - newFontSize; // Move borderY up as font size increases

                            // Return the updated shape with resized font, border size, and position
                            return {
                                ...sh,
                                borderX: sh.borderX, // Keep x the same (as only height is changing with bottom-left corner)
                                borderY: newBorderY, // Adjust y to keep text inside the top border
                                borderWidth: newBorderWidth + 20, // Adding padding around the text
                                borderHeight: newBorderHeight + 20, // Adding padding around the text
                                fontSize: newFontSize, // New font size
                                font: `${newFontSize}px 'Shadows Into Light', cursive` // Update font with new size
                            };
                        }
                    }
                }
                else
                    return sh;
            })
        )
    }
}

export default handleSelectMove;