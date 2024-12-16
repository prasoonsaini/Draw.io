function handleWriteDown(canvasRef, e, currentShape, setCurrentShape, shape, setShape,
  allshapes, setAllshapes, font, setFont, offsetX, offsetY, zoomLevel, user, custom, setSelected) {
  // console.log("called")
  const canvas = canvasRef.current;
  const rect = canvas.getBoundingClientRect();
  const ctx = canvas.getContext("2d");
  // const mouseX = e.clientX - rect.left;
  // const mouseY = e.clientY - rect.top;
  console.log(rect)
  console.log(e)
  let width = 0;
  let height = 0;
  const newfontSize = custom.fontSize || 30;
  console.log("custom: ", custom)
  setFont(newfontSize);
  let virtualX = e.clientX - offsetX;
  let virtualY = e.clientY - offsetY;
  // Create a textarea for entering text
  const textArea = document.createElement('textarea');
  textArea.style.position = 'absolute';
  textArea.style.left = `${virtualX}px`;
  textArea.style.top = `${virtualY}px`;
  textArea.style.padding = '0';
  textArea.style.margin = '0';
  textArea.style.width = 'auto'; // Initial width
  textArea.style.height = `${newfontSize}px`; // Initial height
  textArea.style.resize = 'none';
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.background = 'transparent';
  textArea.style.color = custom.stroke;
  textArea.style.fontSize = `${newfontSize}px`;
  textArea.style.fontFamily = custom.font;
  textArea.style.whiteSpace = 'nowrap'; // Keep text on one line
  textArea.style.overflow = 'hidden';
  document.body.appendChild(textArea);
  textArea.focus();

  // Function to adjust the textarea size dynamically
  const adjustSize = () => {
    textArea.style.height = 'auto';
    textArea.style.width = 'auto';
    textArea.style.height = `${textArea.scrollHeight}px`;
    height = textArea.scrollHeight
    textArea.style.width = `${Math.max(50, textArea.scrollWidth)}px`;
    width = textArea.scrollWidth
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
  setShape('select');
  // Handle clicking outside of the textarea to finalize the input
  const calculateTextDimensions = (text, fontSize) => {
    ctx.font = `${fontSize}px Arial`;
    const lines = text.split("\n");
    const maxWidth = Math.max(...lines.map((line) => ctx.measureText(line).width));
    const totalHeight = lines.length * fontSize;
    return { maxWidth, totalHeight, lines };
  };
  setTimeout(() => {
    const handleOutsideClick = async (event) => {
      if (!textArea.contains(event.target)) {
        const enteredText = textArea.value.trim();
        if (enteredText) {
          // Update current shape to include the text
          const { maxWidth, totalHeight, lines } = calculateTextDimensions(enteredText, newfontSize);
          const newShape = {
            shape: 'text',
            x: virtualX,
            y: virtualY,
            width: maxWidth + 20,
            height: totalHeight + 20,
            text: enteredText,
            font: `${newfontSize}px ${custom.font}`,
            fontSize: newfontSize,
            textFont: custom.font,
            strokeColor: custom.stroke,
            userId: user,
            background: 'transparent',
            fill: 'none',
            strokeWidth: 2,
            strokeStyle: [0, 0],
            slopiness: 1,
            curved: true
          };

          // Set the new shape
          setCurrentShape(newShape);
          const temp = newShape
          try {
            temp.current = false
            temp.shapeId = Math.floor(Math.random() * 10000);
            const response = await fetch('https://draw-io-z8ub-backend.vercel.app/api/shapes', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(temp), // Send the shape data
            });

            if (!response.ok) {
              throw new Error('Network response was not ok');
            }

            const data = await response.json(); // Parse the JSON response

            // Update the shapes state with the newly created shape
            setAllshapes(prevShapes => [data.shapes, ...prevShapes]); // Add the new shape to the beginning of the array

          } catch (error) {
            console.error('Error creating shape:', error);
          }
          // Update allshapes with the new shape
          setAllshapes([...allshapes, newShape]);
        }

        // Remove the textarea after text is entered and click happens outside
        document.body.removeChild(textArea);
        document.removeEventListener('mousedown', handleOutsideClick);

        // Set shape back to 'select' mode

      }
    };

    // Add the event listener to detect clicks outside the textarea
    document.addEventListener('mousedown', handleOutsideClick);
  }, 0);
}

export default handleWriteDown;
