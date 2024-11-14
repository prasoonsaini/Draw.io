async function handleSelectUp(canvasRef, isDragging, setIsDragging, setDraggingIndex, setIsResizing,
    setResizingIndex, isResizing, panning, setPanning, allshapes, user) {
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
