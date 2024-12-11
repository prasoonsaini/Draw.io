import resizeBorder from "../borders/resizableBorder";
import resizeEllipse from "../helpers(resize)/resizeEllipse";
import resizeRectangle from "../helpers(resize)/resizeRectangle";

function handleSelectMove(canvasRef, e, startPos, draggingIndex, isDragging,
    setStartPos, allshapes, setAllshapes, isResizing, setIsResizing, resizingIndex, corner, shape, panning, offsetX, offsetY, zoomLevel, box) {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    let mouseX = (e.clientX - rect.left) / zoomLevel + offsetX;
    let mouseY = (e.clientY - rect.top) / zoomLevel + offsetY;
    const ctx = canvas.getContext('2d');
    //console.log(shape)
    if (isDragging && draggingIndex !== null) {
        const dx = mouseX - startPos.x;
        const dy = mouseY - startPos.y;
        canvas.style.cursor = 'move';
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
                        if (sh.ArrowHeadRef) {
                            const arr = [...allshapes];
                            arr.forEach((e) => {
                                sh.ArrowHeadRef.forEach((f) => {
                                    if (e.shapeId === f.arrowRef) {
                                        e.endX = e.endX + dx;
                                        e.endY = e.endY + dy;
                                    }
                                })
                            });
                            setAllshapes(arr);
                            // call put to update the axis of arrow too in handleselectmove
                        }
                        if (sh.ArrowLegRef) {
                            const arr = [...allshapes];
                            arr.forEach((e) => {
                                sh.ArrowLegRef.forEach((f) => {
                                    if (e.shapeId === f.arrowRef) {
                                        e.startX = e.startX + dx;
                                        e.startY = e.startY + dy;
                                    }
                                })
                            });
                            setAllshapes(arr);
                            // call put to update the axis of arrow too in handleselectmove
                        }
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
                    if (sh.shape === 'rec' || sh.shape === 'image') {
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
                        const { offsetY } = e.nativeEvent;

                        // Calculate new height based on movement
                        let newHeight = offsetY - box.y;

                        // Add a safeguard for minimum height
                        newHeight = Math.max(20, newHeight); // Ensure a minimum height of 20px

                        // Dampening factor to avoid large font size jumps
                        const lineCount = Math.max(1, sh.text.split("\n").length); // Prevent division by 0
                        const newFontSize = Math.max(10, (newHeight / lineCount) * 0.5); // Apply dampening factor

                        return {
                            ...sh,
                            fontSize: newFontSize
                        };
                    }



                }
                else
                    return sh;
            })
        )
    }
}

export default handleSelectMove;