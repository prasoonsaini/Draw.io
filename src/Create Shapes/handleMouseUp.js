const handleMouseUp = async (canvasRef, isDrawing, currentShape, allshapes, setCurrentShape, setAllshapes, setIsDrawing, setShape) => {
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
        temp = { ...temp, current: true, shapeId: Math.floor(Math.random() * 100000) };

        // Update states
        setShape('select');
        setCurrentShape(temp);
        setAllshapes([temp, ...updatedShapes]);

        // Validate the shape before sending it
        if ((temp.shape === 'rec' && (temp.width === 0 || temp.height === 0)) ||
            (temp.shape === 'cir' && temp.diameter === 0) ||
            (temp.shape === 'line' && (temp.startX === temp.endX && temp.startY === temp.endY))) {
            // Invalid shape, reset and return
            setIsDrawing(false);
            setCurrentShape(null);
            return;
        }

        // Send the POST request to create a new shape
        try {
            const response = await fetch('http://localhost:3010/api/shapes', {
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
