import React, { useRef, useState, useEffect } from 'react';
import rough from 'roughjs/bin/rough';
import handleSelectDown from './Select Shapes/handleSelectDown';
import handleMouseDown from './Create Shapes/handleMouseDown';
import handleSelectMove from './Select Shapes/handleSelectMove';
import handleMouseMove from './Create Shapes/handleMouseMove';
import handleSelectUp from './Select Shapes/handleSelectUp';
import handleMouseUp from './Create Shapes/handleMouseUp';
import resizeBorder from './borders/resizableBorder';
import resizeArrow from './borders/resizeArrow';
import ActionBar from './components/action-bar/action-bar';
import ShapeCustomizer from './components/ShapeCustomizer/shapeCustomizer';
import Solid from './components/ShapeCustomizer/SVG/solid';
import handleWriteDown from './Create Shapes/Text/handleWriteDown';
import borderText from './borders/borderText';
import handleMouseDownPanning from './Panning/handleMouseDownPanning';
import handleMouseMovePanning from './Panning/handleMouseMovePanning';
import handleMouseUpPanning from './Panning/handleMouseUpPanning';
import ShareButton from './share-drawing/share-button';
import ShareWidget from './share-drawing/share-widget';
import { v4 as uuidv4 } from 'uuid';
import createUserToken from './CreateToken';
import fetchSessionStatus from './fetchSessionStatus';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';


const RoughCanvas = ({ user, setUser, sessionActive, setSessionActive }) => {
  const canvasRef = useRef(null);
  const [rectangles, setRectangles] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentShape, setCurrentShape] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [allshapes, setAllshapes] = useState([])
  const [shape, setShape] = useState('select')
  const [isResizing, setIsResizing] = useState(false)
  const [resizingIndex, setResizingIndex] = useState(null)
  const [corner, setCorner] = useState('')
  const [selectedShape, setSelectedShape] = useState(null)
  const [tool, setTool] = useState('rectangle');
  const [selected, setSelected] = useState(null);
  const [color, setColor] = useState('black')
  const [allTexts, setAllTexts] = useState([])
  const [font, setFont] = useState(30)
  const [panning, setPanning] = useState(false)
  const [dsize, setdsize] = useState(1)
  // --------Panning and Zooming----------
  const [offsetX, setOffsetX] = useState(0); // Horizontal offset for panning
  const [offsetY, setOffsetY] = useState(0); // Vertical offset for panning
  const [startX, setStartX] = useState(0); // Mouse start position (X)
  const [startY, setStartY] = useState(0); // Mouse start position (Y)
  const [zoomLevel, setZoomLevel] = useState(1); // Zoom level (1 = 100%)
  const [isPanDragging, setIsPanDragging] = useState(false); // Is the user dragging?

  const [socket, setSocket] = useState(null);
  const [isSocketOpen, setIsSocketOpen] = useState(false);
  const prevShapesRef = useRef([]);
  const prevShapesRefCurrent = useRef([]);

  const [share, setShare] = useState(false)
  const location = useLocation();
  const userId = location.pathname.includes('user=')
    ? location.pathname.split('user=')[1]
    : null;
  // const [user, setUser] = useState(null)
  // When the connection is open, notify the //console
  useEffect(() => {
    const fetchShapes = async () => {
      try {
        const response = await fetch('http://localhost:3010/api/shapes'); // Fetch shapes from the API
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        //console.log("main data", data)
        if (user) {
          const userShape = data.filter((sh) => {
            if (sh.userId === user)
              return true;
          })
          setAllshapes(userShape)
        }
        else {
          console.log("User not found yet")
        }
      } catch (error) {
        //console.error('Error fetching shapes:', error);
      }
    };

    fetchShapes(); // Call the fetch function
  }, [user]); // Empty dependency array means this runs once when the component mounts

  // Establish WebSocket connection when component mounts
  useEffect(() => {
    const newSocket = new WebSocket('ws://localhost:8080'); // Replace with your WebSocket server URL

    // Track WebSocket open status
    newSocket.onopen = () => {
      //console.log('WebSocket connection established');
      setIsSocketOpen(true);  // WebSocket is now open
    };
    console.log("use effect called")
    setSocket(newSocket);

    // Handle incoming messages from the WebSocket server
    newSocket.onmessage = (event) => {
      try {
        const receivedData = JSON.parse(event.data); // Assuming the data is a JSON string
        if (receivedData.user !== user)
          return;
        if (!receivedData.session)
          createUserToken({ setUser });
        else {
          if (userId && fetchSessionStatus())
            setUser(userId)
          else
            createUserToken({ setUser });
        }
        //console.log("Received data:", receivedData);
        setAllshapes(receivedData.allshapes); // Update allshapes when data is received
        setCurrentShape(receivedData.currentShape)
      } catch (error) {
        console.error('Error parsing incoming WebSocket data:', error);
      }
    };

    // Clean up WebSocket connection when component unmounts
    return () => {
      newSocket.close();
    };
  }, [user]);

  useEffect(() => {
    if (isSocketOpen && socket && socket.readyState === WebSocket.OPEN) {
      const prevShapes = prevShapesRef.current;  // Get the previous value of allshapes
      const prevCurrent = prevShapesRefCurrent.current
      // Check if allshapes has changed
      const hasChanged = JSON.stringify(prevShapes) !== JSON.stringify(allshapes);
      const hasChangedCurrent = JSON.stringify(prevCurrent) !== JSON.stringify(currentShape);
      if (hasChanged || hasChangedCurrent && allshapes.length > 0) {
        const responseData = {
          allshapes: allshapes,
          currentShape: currentShape,
          user: user,
          session: sessionActive
        }
        const jsonData = JSON.stringify(responseData); // Convert the allshapes array to JSON
        socket.send(jsonData);  // Send the updated data to the server
        //console.log('Data sent to server:', jsonData);
      }

      // Update the previous allshapes ref with the current allshapes
      prevShapesRef.current = allshapes;
      prevShapesRefCurrent.current = currentShape
    }
  }, [allshapes, socket, isSocketOpen, currentShape, user, sessionActive]);  // Effect triggers whenever allshapes, socket, or isSocketOpen changes

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.save(); // Save the current context stat
    const roughCanvas = rough.canvas(canvas);

    // Clear the canvas before re-drawing
    // const renderShapes = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const temp = allshapes.filter(sh => {
      if (sh && sh.current === true) {
        setSelectedShape(sh)
        return true
      }
    })
    if (temp.length === 0)
      setSelected(null)

    allshapes.forEach(sh => {
      // //console.log("pppppsasas",sh.strokeStyle)
      if (sh && sh.shape === 'rec') {
        const virtualX = sh.x - offsetX; // Adjust for horizontal panning
        const virtualY = sh.y - offsetY; // Adjust for vertical panning
        roughCanvas.rectangle(virtualX * zoomLevel, virtualY * zoomLevel, sh.width * zoomLevel, sh.height * zoomLevel, {
          stroke: `${sh.strokeColor}`,
          fill: `${sh.backgroundColor}`,
          fillStyle: `${sh.fillType}`,
          strokeWidth: `${sh.strokeWidth * zoomLevel}`,
          roughness: `${sh.slopiness}`,
          strokeLineDash: sh.strokeStyle,
          seed: 12345,
        });
        if (sh.current) {
          resizeBorder({ canvasRef, x: (virtualX - 5) * zoomLevel, y: (virtualY - 5) * zoomLevel, width: (sh.width + 10) * zoomLevel, height: (sh.height + 10) * zoomLevel })
          setSelected('rec')
        }
      }
      if (sh && sh.shape === 'cir') {
        roughCanvas.circle(sh.x, sh.y, sh.diameter, {
          stroke: `${sh.strokeColor}`,
          strokeWidth: `${sh.strokeWidth}`,
          fillStyle: `${sh.fillType}`,
          fill: `${sh.backgroundColor}`,
          strokeLineDash: sh.strokeStyle,
          fillWeight: 1,
          roughness: `${sh.slopiness}`,
          seed: 12345
        });
        if (sh.current) {
          resizeBorder({ canvasRef, x: sh.x - sh.diameter / 2 - 10, y: sh.y - sh.diameter / 2 - 10, width: sh.diameter + 20, height: sh.diameter + 20 })
          setSelected('cir')
        }
      }
      if (sh && sh.shape === 'line') {
        const virtualEndX = sh.endX - offsetX; // Adjust for horizontal panning
        const virtualEndY = sh.endY - offsetY;
        const virtualStartX = sh.startX - offsetX
        const virtualStartY = sh.startY - offsetY
        roughCanvas.line(virtualStartX * zoomLevel, virtualStartY * zoomLevel, virtualEndX * zoomLevel, virtualEndY * zoomLevel, {
          seed: 12345,
          stroke: `${sh.strokeColor}`,
          strokeWidth: `${sh.strokeWidth}`,
          strokeLineDash: sh.strokeStyle,
          roughness: `${sh.slopiness}`
        });
        const arrowHeadLength = 20 * zoomLevel;
        const angle = Math.atan2(sh.endY - sh.startY, sh.endX - sh.startX);

        // Left part of the arrowhead
        roughCanvas.line(
          virtualEndX * zoomLevel,
          virtualEndY * zoomLevel,
          virtualEndX * zoomLevel - arrowHeadLength * Math.cos(angle - Math.PI / 6),
          virtualEndY * zoomLevel - arrowHeadLength * Math.sin(angle - Math.PI / 6),
          {
            seed: 12345,
            stroke: `${sh.strokeColor}`,
            strokeWidth: `${sh.strokeWidth}`,
            strokeLineDash: sh.strokeStyle,
            roughness: `${sh.slopiness}`
          }
        );

        // Right part of the arrowhead
        roughCanvas.line(
          virtualEndX * zoomLevel,
          virtualEndY * zoomLevel,
          virtualEndX * zoomLevel - arrowHeadLength * Math.cos(angle + Math.PI / 6),
          virtualEndY * zoomLevel - arrowHeadLength * Math.sin(angle + Math.PI / 6),
          {
            seed: 12345,
            stroke: `${sh.strokeColor}`,
            strokeWidth: `${sh.strokeWidth}`,
            strokeLineDash: sh.strokeStyle,
            roughness: `${sh.slopiness}`
          }
        );
        if (sh.current) {
          resizeArrow({
            canvasRef, startX: virtualStartX * zoomLevel, startY: virtualStartY * zoomLevel,
            endX: virtualEndX * zoomLevel, endY: virtualEndY * zoomLevel
          })
          setSelected('line')
        }
      };
      if (sh && sh.shape === 'hand') {
        const points = sh.points;
        let min_x = Infinity, min_y = Infinity, max_x = -Infinity, max_y = -Infinity;

        for (let i = 0; i < points.length; i++) {
          const adjustedX = points[i].x - offsetX;
          const adjustedY = points[i].y - offsetY;

          // Update the bounding box values
          min_x = Math.min(adjustedX, min_x);
          min_y = Math.min(adjustedY, min_y);
          max_x = Math.max(adjustedX, max_x);
          max_y = Math.max(adjustedY, max_y);

          // Draw the line segment
          if (i > 0) { // Avoid accessing points[-1]
            const prevAdjustedX = points[i - 1].x - offsetX;
            const prevAdjustedY = points[i - 1].y - offsetY;
            roughCanvas.line(
              prevAdjustedX * zoomLevel * dsize,
              prevAdjustedY * zoomLevel * dsize,
              adjustedX * zoomLevel * dsize,
              adjustedY * zoomLevel * dsize,
              {
                stroke: `${sh.strokeColor}`,
                strokeWidth: `${sh.strokeWidth}`,
                roughness: `${sh.slopiness}`,
                strokeLineDash: sh.strokeStyle,
                seed: 12345
              }
            );
          }
        }

        if (sh.current) {
          // Draw the border rectangle around the shape
          resizeBorder({
            canvasRef,
            x: min_x * zoomLevel,
            y: min_y * zoomLevel,
            width: Math.abs(max_x - min_x) * zoomLevel,
            height: Math.abs(max_y - min_y) * zoomLevel
          });
          setSelected('hand');
        }
      }

      if (sh && sh.shape === 'ellipse') {
        const virtualX = sh.x - offsetX
        const virtualY = sh.y - offsetY
        roughCanvas.ellipse(virtualX * zoomLevel, virtualY * zoomLevel,
          sh.width * zoomLevel, sh.height * zoomLevel, {
          seed: 12345,
          stroke: `${sh.strokeColor}`,
          fill: `${sh.backgroundColor}`,
          strokeWidth: `${sh.strokeWidth}`,
          fillStyle: `${sh.fillType}`,
          strokeLineDash: sh.strokeStyle,
          roughness: `${sh.slopiness}`,
        });
        if (sh.current) {
          // //console.log("current",sh.x-sh.width/2,sh.y-sh.height/2,sh.width,sh.height)
          resizeBorder({
            canvasRef, x: virtualX * zoomLevel - sh.width * zoomLevel / 2, y: virtualY * zoomLevel - sh.height * zoomLevel / 2,
            width: sh.width * zoomLevel, height: sh.height * zoomLevel
          })
          setSelected('elli')
        }
      }
      if (sh && sh.shape === 'text') {
        const lines = sh.text.split('\n'); // Split the text by newlines
        const lineHeight = sh.fontSize * zoomLevel; // Adjust line height
        const adjustedFontSize = sh.fontSize * zoomLevel; // Adjust font size based on zoom level

        // Update the font size in the canvas context (ctx)
        ctx.font = `${adjustedFontSize}px ${sh.fontFamily || 'Arial'}`; // You can set default font family
        ctx.fillStyle = sh.fillStyle;
        // console.log(zoomLevel)
        const virtualX = sh.x - offsetX;
        const virtualY = sh.y - offsetY;

        // Loop through each line and render it with the appropriate line height
        lines.forEach((line, index) => {
          ctx.fillText(line, virtualX * zoomLevel, virtualY * zoomLevel + (index * lineHeight));
        });

        if (sh.current) {
          // Draw the border around the text with zoom adjustment
          borderText({
            canvasRef,
            x: (sh.borderX - offsetX) * zoomLevel,
            y: (sh.borderY - adjustedFontSize - 10 - offsetY) * zoomLevel,
            width: sh.borderWidth * zoomLevel,
            height: sh.borderHeight * zoomLevel
          });
          setSelected('text');
        }
      }

    })

    // Draw the current rectangle (while drawing)

    if (currentShape) {
      if (shape === 'rec') {
        const virtualX = currentShape.x - offsetX; // Adjust for horizontal panning
        const virtualY = currentShape.y - offsetY;
        roughCanvas.rectangle(virtualX * zoomLevel, virtualY * zoomLevel, currentShape.width * zoomLevel, currentShape.height * zoomLevel, {
          stroke: `${currentShape.strokeColor}`,
          fill: `${currentShape.backgroundColor}`,
          fillStyle: `${currentShape.fillType}`,
          strokeWidth: `${currentShape.strokeWidth}`,
          strokeLineDash: currentShape.strokeStyle,
          roughness: 1,
          seed: 12345,
          roughness: `${currentShape.slopiness}`,         // Controls how rough the edges are
          bowing: 1,             // Controls the wobbliness of the lines
          curveStepCount: 1000
        });
        if (currentShape.current) {
          resizeBorder({ canvasRef, x: (virtualX - 10) * zoomLevel, y: (virtualY - 10) * zoomLevel, width: (currentShape.width + 20) * zoomLevel, height: (currentShape.height + 20) * zoomLevel })
          setSelected('rec')
        }
      }
      if (shape === 'cir') {
        roughCanvas.circle(currentShape.x, currentShape.y, currentShape.diameter, {
          stroke: `${currentShape.strokeColor}`,
          strokeWidth: `${currentShape.strokeWidth}`,
          fillWeight: 1,
          fill: `${currentShape.backgroundColor}`,
          fillStyle: `${currentShape.fillType}`,
          roughness: `${currentShape.slopiness}`,
          strokeLineDash: currentShape.strokeStyle,
          seed: 12345
        })
      }
      if (shape === 'line') {
        const virtualEndX = currentShape.endX - offsetX; // Adjust for horizontal panning
        const virtualEndY = currentShape.endY - offsetY;
        const virtualStartX = currentShape.startX - offsetX
        const virtualStartY = currentShape.startY - offsetY
        roughCanvas.line(virtualStartX * zoomLevel, virtualStartY * zoomLevel, virtualEndX * zoomLevel, virtualEndY * zoomLevel, {
          seed: 12345,
          stroke: `${currentShape.strokeColor}`,
          strokeWidth: `${currentShape.strokeWidth}`,
          strokeLineDash: currentShape.strokeStyle,
        });
        if (currentShape.current) {
          resizeArrow({
            canvasRef, startX: virtualStartX * zoomLevel,
            startY: virtualStartY * zoomLevel, endX: virtualEndX * zoomLevel, endY: virtualEndY * zoomLevel
          })
          setSelected('line')
        }
      }
      if (shape === 'hand') {
        const { points, strokeColor, strokeWidth, slopiness, strokeStyle } = currentShape;

        // If there are no points to draw, return early
        if (!points || points.length < 5) return;

        // Request animation frame to optimize the drawing
        const draw = () => {
          for (let i = 0; i < points.length - 1; i++) {
            const x1 = points[i].x - offsetX;
            const y1 = points[i].y - offsetY;
            const x2 = points[i + 1].x - offsetX;
            const y2 = points[i + 1].y - offsetY;

            roughCanvas.line(
              x1 * zoomLevel,
              y1 * zoomLevel,
              x2 * zoomLevel,
              y2 * zoomLevel,
              {
                seed: 12345,
                stroke: strokeColor,
                strokeWidth,
                roughness: slopiness,
                strokeLineDash: strokeStyle,
              }
            );
          }
        };

        // Use requestAnimationFrame for smoother rendering
        const animationFrameId = requestAnimationFrame(draw);

        // Cleanup function to cancel animation frame if needed
        return () => cancelAnimationFrame(animationFrameId);
      }
      if (shape === 'ellipse') {
        const virtualX = currentShape.x - offsetX
        const virtualY = currentShape.y - offsetY
        roughCanvas.ellipse(virtualX * zoomLevel, virtualY * zoomLevel, currentShape.width * zoomLevel, currentShape.height * zoomLevel, {
          seed: 12345,
          stroke: `${currentShape.strokeColor}`,
          fill: `${currentShape.backgroundColor}`,
          fillStyle: `${currentShape.fillType}`,
          strokeWidth: `${currentShape.strokeWidth}`,
          roughness: `${currentShape.slopiness}`,
          strokeLineDash: currentShape.strokeStyle,
        });
        if (currentShape.current) {
          // //console.log("current",sh.x-sh.width/2,sh.y-sh.height/2,sh.width,sh.height)
          resizeBorder({
            canvasRef, x: virtualX * zoomLevel - currentShape.width / 2 * zoomLevel, y: virtualY * zoomLevel - currentShape.height / 2 * zoomLevel,
            width: currentShape.width * zoomLevel, height: currentShape.height * zoomLevel
          })
          setSelected('elli')
        }
      }
    }
    console.log(offsetX, offsetY, zoomLevel)
  }, [allshapes, currentShape, offsetX, offsetY, zoomLevel]);


  const handleWheel = (e) => {
    const zoomSensitivity = 0.02; // Adjust zoom sensitivity
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    // Get current center position of the canvas in the viewport
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate cursor position relative to canvas
    const cursorX = e.clientX - rect.left;
    const cursorY = e.clientY - rect.top;

    // Calculate the current zoom ratio
    const prevZoom = zoomLevel;
    const newZoom = e.deltaY < 0
      ? Math.min(zoomLevel + zoomSensitivity, 5) // Zoom in
      : Math.max(zoomLevel - zoomSensitivity, 0.1); // Zoom out

    setZoomLevel(newZoom);

    // Calculate the difference in zoom ratios
    const zoomFactor = newZoom / prevZoom;

    // Adjust offset to keep canvas centered relative to the cursor
    setOffsetX((prevOffsetX) => prevOffsetX - (cursorX - centerX) * (zoomFactor - 1));
    setOffsetY((prevOffsetY) => prevOffsetY - (cursorY - centerY) * (zoomFactor - 1));
  };


  return (
    <div>
      {/* <ActionBar tool={tool} setTool={setTool} /> */}
      <ActionBar shape={shape} setShape={setShape} />
      <ShareButton setShare={setShare} />
      {share ? <ShareWidget user={user} sessionActive={sessionActive} setSessionActive={setSessionActive} /> : <></>}
      {selected ? <ShapeCustomizer color={color} setColor={setColor} allshapes={allshapes} setAllshapes={setAllshapes} selected={selected} selectedShape={selectedShape} /> : <></>}
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        // style={{ border: '1px solid black' }}
        onMouseDown={(e) => shape === 'select' ? handleSelectDown(canvasRef, e, currentShape, setCurrentShape, setIsDragging, setDraggingIndex, setStartPos,
          allshapes, setAllshapes, isResizing, setIsResizing, setResizingIndex, resizingIndex, corner, setCorner, shape, setPanning, offsetX, offsetY, zoomLevel)
          : shape === 'text' ? handleWriteDown(canvasRef, e, currentShape, setCurrentShape, shape, setShape, allshapes, setAllshapes, font, setFont, offsetX, offsetY, zoomLevel, user)
            : shape === "pan" ? handleMouseDownPanning(e, setIsPanDragging, setStartX, setStartY, offsetX, offsetY)
              : handleMouseDown(canvasRef, e, setIsDrawing, setCurrentShape, shape, setShape, offsetX, offsetY, zoomLevel)}

        onMouseMove={(e) => shape === 'select' ? handleSelectMove(canvasRef, e, startPos, draggingIndex, isDragging, setStartPos, setAllshapes,
          isResizing, setIsResizing, resizingIndex, corner, shape, panning, offsetX, offsetY, zoomLevel)
          : shape === "pan" ? handleMouseMovePanning(e, isPanDragging, setOffsetX, setOffsetY, startX, startY)
            : handleMouseMove(canvasRef, e, isDrawing, currentShape, setCurrentShape, shape, offsetX, offsetY, zoomLevel)}

        onMouseUp={() => shape === 'select' ? handleSelectUp(canvasRef, isDragging, setIsDragging, setDraggingIndex,
          setIsResizing, setResizingIndex, isResizing, panning, setPanning, allshapes, user)
          : shape === "pan" ? handleMouseUpPanning(setIsPanDragging)
            : handleMouseUp(canvasRef, isDrawing, currentShape, allshapes, setCurrentShape, setAllshapes, setIsDrawing, setShape, user)}

        onWheel={handleWheel}
      />
    </div>
  );
};

export default RoughCanvas;