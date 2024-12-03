import ArrowNearShape from "../helpers(select)/ArrowNearShape";

const handleMouseUp = async (canvasRef, isDrawing, currentShape, allshapes, setCurrentShape, setAllshapes, setIsDrawing, setShape, user, undoStack, setUndoStack) => {
    console.log("user", user)
    if (isDrawing && currentShape) {
        // Finalize the shape when the mouse is released

        let temp = { ...currentShape }; // Make a copy of the current shape

        // Adjust position and dimensions if negative
        if (temp.height < 0) {
            temp.height = Math.abs(temp.height);
            temp.y = currentShape.y - temp.height;
        }
        if (temp.width < 0) {
            temp.width = Math.abs(temp.width);
            temp.x = currentShape.x - temp.width;
        }

        // Mark all previous shapes as not current
        const updatedShapes = allshapes.map(shape => ({
            ...shape,
            current: false,
        }));

        // Mark the current shape as finalized
        if (temp.shape !== 'line')
            temp = { ...temp, current: false, userId: user, shapeId: Math.floor(Math.random() * 100000) };
        else
            temp = { ...temp, current: false, userId: user };

        // Update states
        setShape('select');
        setCurrentShape(temp);
        setAllshapes([temp, ...updatedShapes]);
        console.log("setUndoStack:", typeof setUndoStack);
        if (typeof setUndoStack !== 'function') {
            throw new Error("setUndoStack is not a function. Check how it's passed!");
        }
        // setUndoStack([...undoStack, [temp, ...updatedShapes]]);
        setUndoStack((prevUndoStack) => [...prevUndoStack, [temp, ...updatedShapes]]);

        // Validate the shape before sending it
        if ((temp.shape === 'rec' && (temp.width === 0 || temp.height === 0)) ||
            (temp.shape === 'cir' && temp.diameter === 0) ||
            (temp.shape === 'line' && (temp.startX === temp.endX && temp.startY === temp.endY))) {
            // Invalid shape, reset and return
            setIsDrawing(false);
            setCurrentShape(null);
            return;
        }
        console.log("temwrwrw", temp)
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

                setAllshapes([...updatedShapes, temp]);

                console.log("Updated allshapes", [...updatedShapes, temp]);
                // Call PUT or additional logic if needed
            }
        }

        // Send the POST request to create a new shape
        try {
            const response = await fetch('http://localhost:3020/shapes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(temp), // Send the shape data
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const newShape = await response.json(); // Parse the JSON response
            // Optionally update the state with the new shape from the server

        } catch (error) {
            console.error('Error creating shape:', error);
        }

        // Finalize drawing state
        setIsDrawing(false);
        setCurrentShape(null);
    }
};

export default handleMouseUp;
