function updateText(
    canvasRef, e, currentShape, setCurrentShape, shape, setShape,
    allshapes, setAllshapes, font, setFont, offsetX, offsetY, zoomLevel, user, updateShape
) {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");

    // Set new font size
    const newfontSize = updateShape.fontSize;
    setFont(newfontSize);

    let virtualX = updateShape.x + offsetX;
    let virtualY = updateShape.y + offsetY;

    // Create a textarea for entering text
    const textArea = document.createElement('textarea');
    textArea.value = updateShape.text;
    textArea.style.height = `${updateShape.height}px`;
    textArea.style.width = `${updateShape.width}px`; // Initial width
    textArea.style.position = 'absolute';
    textArea.style.left = `${virtualX}px`;
    textArea.style.top = `${virtualY}px`;
    textArea.style.padding = '0';
    textArea.style.margin = '0';
    textArea.style.resize = 'none';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.background = 'transparent';
    textArea.style.color = 'orange';
    textArea.style.fontSize = `${newfontSize}px`;
    textArea.style.fontFamily = "'Caveat', cursive";
    textArea.style.whiteSpace = 'nowrap'; // Keep text on one line
    textArea.style.overflow = 'hidden';
    document.body.appendChild(textArea);
    textArea.focus();

    // Function to adjust the textarea size dynamically
    const adjustSize = () => {
        textArea.style.height = 'auto';
        textArea.style.width = 'auto';
        textArea.style.height = `${textArea.scrollHeight}px`;
        textArea.style.width = `${Math.max(50, textArea.scrollWidth)}px`;
    };

    // Attach the dynamic resizing logic on input
    textArea.addEventListener('input', adjustSize);

    // Handle pressing the Enter key to add new lines
    textArea.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            textArea.value += '\n'; // Add a new line
            adjustSize(); // Adjust height for new line
        }
    });

    // Handle clicking outside of the textarea to finalize the input
    const calculateTextDimensions = (text, fontSize) => {
        ctx.font = `${fontSize}px 'Caveat', cursive`;
        const lines = text.split("\n");
        const maxWidth = Math.max(...lines.map((line) => ctx.measureText(line).width));
        const totalHeight = lines.length * fontSize;
        return { maxWidth, totalHeight, lines };
    };

    // Remove the shape from allshapes by shapeId
    const handleOutsideClick = async (event) => {
        if (!textArea.contains(event.target)) {
            const enteredText = textArea.value.trim();
            if (enteredText) {
                // Calculate the new shape dimensions
                const { maxWidth, totalHeight, lines } = calculateTextDimensions(enteredText, newfontSize);

                // Create a new shape
                const newShape = {
                    shape: 'text',
                    x: virtualX,
                    y: virtualY,
                    width: maxWidth + 20,
                    height: totalHeight + 20,
                    lines: lines,
                    text: enteredText,
                    font: `${newfontSize}px 'Caveat', cursive`,
                    fontSize: newfontSize,
                    fillStyle: 'orange',
                    userId: user,
                    textFont: "'Caveat', cursive",
                    strokeColor: 'orange',
                    shapeId: updateShape.shapeId
                };

                // Update current shape to include the new text shape
                setCurrentShape(newShape);

                // Remove the old shape and add the new shape to the allshapes array
                setAllshapes(prevShapes => {
                    // Remove the shape with the matching shapeId
                    const filteredShapes = prevShapes.filter(shape => shape.shapeId !== updateShape.shapeId);
                    return [newShape, ...filteredShapes]; // Add the new shape at the beginning
                });
                console.log("shape id ----", newShape.shapeId)
                const response = await fetch(`http://localhost:3020/shapes/${newShape.shapeId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newShape),
                })
                if (!response.ok) {
                    console.error("Updating text was not ok")
                }
                // Remove the textarea after text is entered and click happens outside
                document.body.removeChild(textArea);
                document.removeEventListener('mousedown', handleOutsideClick);

                // Set shape back to 'select' mode
                setShape('select');
            }
        }
    };

    // Add the event listener to detect clicks outside the textarea
    setTimeout(() => {
        document.addEventListener('mousedown', handleOutsideClick);
    }, 0);
}

export default updateText;
