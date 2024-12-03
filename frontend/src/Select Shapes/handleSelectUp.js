import ArrowNearShape from "../helpers(select)/ArrowNearShape";

async function handleSelectUp(canvasRef, isDragging, setIsDragging, setDraggingIndex, setIsResizing,
    setResizingIndex, isResizing, panning, setPanning, allshapes, setAllshapes, user) {
    if (isDragging) {
        // Stop dragging
        setIsDragging(false);
        setDraggingIndex(null);
        const shapes = allshapes
        for (const temp of shapes) {
            try {
                // const i = { ...temp, userId: user }
                const response = await fetch(`http://localhost:3020/shapes/${temp.shapeId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(temp), // Send the shape data
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

            } catch (error) {
                console.error('Error updating shape:', error);
            }
        }
    } else if (isResizing) {
        setIsResizing(false);
        setResizingIndex(null);

        const shapes = [...allshapes];  // Create a shallow copy of allshapes

        try {
            await Promise.all(shapes.map(async (temp) => {
                //console.log("temp", temp);
                if (temp.shape === 'line') {

                    const head_shapeId = ArrowNearShape(temp.endX, temp.endY, allshapes);
                    if (head_shapeId > 0) {
                        console.log("arrow head found", head_shapeId);

                        const updatedShapes = allshapes.map((shape) => {
                            if (shape.shapeId === head_shapeId) {
                                // Clone the shape and update its ArrowHeadRef
                                return {
                                    ...shape,
                                    ArrowHeadRef: [...(shape.ArrowHeadRef || []), { arrowRef: temp.shapeId }] // Ensure ArrowHeadRef is an array
                                };
                            }
                            return shape; // Return the shape as is if not matching
                        });

                        setAllshapes([...updatedShapes]);

                        console.log("Updated allshapes", [...updatedShapes, temp]);
                        // Call PUT or additional logic if needed
                    }
                    const leg_shapeId = ArrowNearShape(temp.startX, temp.startY, allshapes);
                    if (leg_shapeId > 0) {
                        console.log("arrow head found", leg_shapeId);

                        const updatedShapes = allshapes.map((shape) => {
                            if (shape.shapeId === leg_shapeId) {
                                // Clone the shape and update its ArrowHeadRef
                                return {
                                    ...shape,
                                    ArrowLegRef: [...(shape.ArrowLegRef || []), { arrowRef: temp.shapeId }] // Ensure ArrowHeadRef is an array
                                };
                            }
                            return shape; // Return the shape as is if not matching
                        });

                        setAllshapes([...updatedShapes]);

                        // console.log("Updated allshapes", [...updatedShapes, temp]);
                        // Call PUT or additional logic if needed
                    }
                }

                const response = await fetch(`http://localhost:3020/shapes/${temp.shapeId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(temp),  // Send the shape data
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
            }));
        } catch (error) {
            console.error('Error updating shapes:', error);
        }
    }
    else if (panning) {
        setPanning(false);
    }
}

export default handleSelectUp;
