function handleWriteDown(canvasRef, e, currentShape, setCurrentShape, shape, setShape,
  allshapes, setAllshapes, font, setFont, offsetX, offsetY, zoomLevel, user) {
  // console.log("called")
  const canvas = canvasRef.current;
  const rect = canvas.getBoundingClientRect();
  // const mouseX = e.clientX - rect.left;
  // const mouseY = e.clientY - rect.top;
  console.log(rect)
  console.log(e)
  let width = 0;
  let height = 0;
  const newfontSize = 30;
  setFont(newfontSize);
  let virtualX = e.clientX + offsetX;
  let virtualY = e.clientY + offsetY;
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
  textArea.style.background = 'grey';
  textArea.style.color = 'black';
  textArea.style.fontSize = `${newfontSize}px`;
  textArea.style.fontFamily = "'Shadows Into Light', cursive";;
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
  setTimeout(() => {
    const handleOutsideClick = async (event) => {
      if (!textArea.contains(event.target)) {
        const enteredText = textArea.value.trim();
        if (enteredText) {
          // Update current shape to include the text
          const newShape = {
            shape: 'text',
            x: virtualX,
            y: virtualY,
            text: enteredText,
            font: `${newfontSize}px 'Shadows Into Light', cursive`,
            fontSize: newfontSize,
            borderX: virtualX - 10,
            borderY: virtualY - newfontSize - 10,
            borderWidth: width + 20,
            borderHeight: height + 20,
            fillStyle: 'black',
            userId: user
          };

          // Set the new shape
          setCurrentShape(newShape);
          const temp = newShape
          try {
            temp.current = false
            temp.shapeId = Math.floor(Math.random() * 10000);
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
