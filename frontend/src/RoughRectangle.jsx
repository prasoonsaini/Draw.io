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
import createUserToken from './CreateToken';
import fetchSessionStatus from './fetchSessionStatus';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import CurvedRectangle from './CurvedEdgesRect';
import { ControlPanel } from './components/control-panel/ControlPanel';
import ImageUpload from './Image/ImageUpload';
import ImageApp from './Image/ImageFromKonva';
import handleDoubleClick from './Create Shapes/Text/handleDoubleClick';
// import CurvedRectangle from './CurvedEdgesRect';


const RoughCanvas = ({ user, setUser, sessionActive, setSessionActive, socket, setSocket, setAllshapes, allshapes, undoStack, setUndoStack }) => {
  const canvasRef = useRef(null);
  const [rectangles, setRectangles] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentShape, setCurrentShape] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  // const [allshapes, setAllshapes] = useState([])
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
  const [ShareWidgetRef, setShareWidgetRef] = useState(null)
  // --------Panning and Zooming----------
  const [offsetX, setOffsetX] = useState(0); // Horizontal offset for panning
  const [offsetY, setOffsetY] = useState(0); // Vertical offset for panning
  const [startX, setStartX] = useState(0); // Mouse start position (X)
  const [startY, setStartY] = useState(0); // Mouse start position (Y)
  const [zoomLevel, setZoomLevel] = useState(1); // Zoom level (1 = 100%)
  const [isPanDragging, setIsPanDragging] = useState(false); // Is the user dragging?
  const [scale, setScale] = useState(1)
  const [share, setShare] = useState(false)
  const location = useLocation();
  const prevShapesRef = useRef([]);
  const prevShapesRefCurrent = useRef([]);
  const [clientCount, setClientCount] = useState(0)
  const [redoStack, setRedoStack] = useState([])
  const [customiser, setCustomiser] = useState(true)
  const images = new Map();
  const [custom, setCustom] = useState({
    stroke: '#1e1e1e',
    background: 'transparent',
    fill: 'none',
    strokeWidth: 2,
    strokeStyle: [0, 0],
    slopiness: 1,
    curved: true,
    font: "'Caveat', cursive",
    fontSize: 30
  })
  // text ----
  const [box, setBox] = useState({ x: 100, y: 100, width: 200, height: 50 });
  const userId = location.pathname.includes('user=')
    ? location.pathname.split('user=')[1]
    : null;

  const [image, setImage] = useState(null);

  useEffect(() => {
    console.log("All shapes", allshapes)
    if (!allshapes)
      return
    // Only send if allshapes or currentShape have changed
    if (socket && socket.readyState === WebSocket.OPEN) {
      const prevShapes = prevShapesRef.current;  // Get the previous value of allshapes
      const prevCurrent = prevShapesRefCurrent.current
      const hasChanged = JSON.stringify(prevShapes) !== JSON.stringify(allshapes);
      const hasChangedCurrent = JSON.stringify(prevCurrent) !== JSON.stringify(currentShape);
      // const temp = [...allshapes]
      // temp.forEach((e) => {
      //   if (e.shape === 'image') {
      //     delete e.img;
      //   }
      // })
      if (hasChanged || hasChangedCurrent && allshapes.length > 0) {
        const message = {
          user: user,
          session: true,
          allshapes: allshapes,
          currentShape: currentShape,
          clientCount: clientCount
        };
        socket.send(JSON.stringify(message));  // Send as JSON string

        // Update the previous values to the current ones after sending
        prevShapesRef.current = allshapes;
        prevShapesRefCurrent.current = currentShape
      }
    }
  }, [socket, user, allshapes, currentShape]);  // Add missing dependencies

  useEffect(() => {
    console.log("All shapes", allshapes)
    if (!allshapes)
      return
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.onmessage = async (message) => {  // Use `onmessage` instead of `.on('message')`
        const msg = JSON.parse(message.data);  // Parse the message data
        console.log('Received message', msg);

        if (!msg.session) {
          console.log('Received message in not session------------', msg);
          await createUserToken({ setUser });
          window.location.reload(true)
        } else {
          setAllshapes(msg.allshapes);
          setCurrentShape(msg.currentShape);
        }
        setClientCount(msg.clientCount)
      };
    }
  }, [socket]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.save(); // Save the current context stat
    const roughCanvas = rough.canvas(canvas);

    // Clear the canvas before re-drawing
    // const renderShapes = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const temp = Array.isArray(allshapes) ? allshapes.filter(sh => {
      if (sh && sh.current === true) {
        setSelectedShape(sh)
        return true
      }
    }) : []
    if (temp.length === 0)
      setSelected(null)

    Array.isArray(allshapes) ? allshapes.forEach(sh => {
      // //console.log("pppppsasas",sh.strokeStyle)
      if (sh && sh.shape === 'rec') {
        const virtualX = sh.x - offsetX; // Adjust for horizontal panning
        const virtualY = sh.y - offsetY; // Adjust for vertical panning
        if (!sh.curved) {
          roughCanvas.rectangle(virtualX * zoomLevel, virtualY * zoomLevel, sh.width * zoomLevel, sh.height * zoomLevel, {
            stroke: `${sh.strokeColor}`,
            fill: `${sh.backgroundColor}`,
            fillStyle: `${sh.fillType}`,
            strokeWidth: `${sh.strokeWidth * zoomLevel}`,
            roughness: `${sh.slopiness}`,
            strokeLineDash: sh.strokeStyle,
            seed: sh.seed,
          });
        }
        else {
          CurvedRectangle(canvasRef, virtualX * zoomLevel, virtualY * zoomLevel, sh.width * zoomLevel, sh.height * zoomLevel, sh.strokeColor,
            sh.backgroundColor, sh.fillType, sh.strokeWidth * zoomLevel, sh.slopiness, sh.strokeStyle)
        }
        if (sh.current) {
          resizeBorder({ canvasRef, x: (virtualX - 5) * zoomLevel, y: (virtualY - 5) * zoomLevel, width: (sh.width + 10) * zoomLevel, height: (sh.height + 10) * zoomLevel })
          setSelected('rec')
        }
      }
      if (sh && sh.shape === 'image' && sh.imageUrl) {
        const virtualX = sh.x - offsetX; // Adjust for horizontal panning
        const virtualY = sh.y - offsetY;
        const normalizedUrl = sh.imageUrl.trim(); // Normalize the URL
        console.log("Normalized Image URL:", normalizedUrl);
        console.log("Images map before check:", images);
        const cachedImg = images.get(normalizedUrl);
        console.log("Cached image:", cachedImg);
        if (!cachedImg || !(cachedImg instanceof Image) || !cachedImg.complete) {
          const img = new Image();
          img.src = normalizedUrl;

          img.onload = () => {
            console.log(`Image loaded: ${normalizedUrl}`);
            images.set(normalizedUrl, img); // Store the normalized URL
            console.log("Updated images map:", Array.from(images.keys()));

            ctx.drawImage(
              img,
              virtualX * zoomLevel,
              virtualY * zoomLevel,
              sh.width * zoomLevel,
              sh.height * zoomLevel
            );
          };

          img.onerror = () => {
            console.error(`Failed to load image: ${sh.imageUrl}`);
          };
        } else {
          // Use the cached image
          console.log("Using cached image:", cachedImg);

          ctx.drawImage(
            cachedImg,
            virtualX * zoomLevel,
            virtualY * zoomLevel,
            sh.width * zoomLevel,
            sh.height * zoomLevel
          );
        }

        if (sh.current) {
          resizeBorder({
            canvasRef,
            x: (virtualX - 5) * zoomLevel,
            y: (virtualY - 5) * zoomLevel,
            width: (sh.width + 10) * zoomLevel,
            height: (sh.height + 10) * zoomLevel,
          });
          setSelected("image");
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
          seed: sh.seed
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
          seed: sh.seed,
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
            seed: sh.seed,
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
            seed: sh.seed,
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
                seed: sh.seed
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
          seed: sh.seed,
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
        const lines = sh.text.split('\n'); // Split text into lines
        const adjustedFontSize = sh.fontSize * zoomLevel; // Adjust font size for zoom
        ctx.font = `${adjustedFontSize}px ${sh.fontFamily || `${sh.textFont}`}`;
        ctx.fillStyle = sh.strokeColor;

        // Recalculate the bounding box dimensions
        const textWidths = lines.map((line) => ctx.measureText(line).width);
        const maxWidth = Math.max(...textWidths); // Maximum width of all lines
        const totalHeight = lines.length * sh.fontSize; // Total height based on font size and lines

        sh.width = maxWidth + 20; // Add padding
        sh.height = totalHeight + 10; // Add padding

        // Render each line of text
        lines.forEach((line, index) => {
          ctx.fillText(
            line,
            ((sh.x + 10) - offsetX) * zoomLevel,
            ((sh.y + sh.fontSize * (index + 1)) - offsetY) * zoomLevel
          );
        });

        // Draw bounding box
        if (sh.current) {
          ctx.strokeStyle = "blue";
          // ctx.strokeRect(
          //   (sh.x - offsetX) * zoomLevel,
          //   (sh.y - offsetY) * zoomLevel,
          //   sh.width * zoomLevel,
          //   sh.height * zoomLevel
          // );
          borderText({
            canvasRef, x: (sh.x - offsetX) * zoomLevel, y: (sh.y - offsetY) * zoomLevel,
            width: sh.width * zoomLevel, height: sh.height * zoomLevel
          })
          setSelected('text');
        }
      }


    }) : null

    // Draw the current rectangle (while drawing)

    if (currentShape) {
      if (shape === 'rec') {
        const virtualX = currentShape.x - offsetX; // Adjust for horizontal panning
        const virtualY = currentShape.y - offsetY;
        if (!currentShape.curved) {
          roughCanvas.rectangle(virtualX * zoomLevel, virtualY * zoomLevel, currentShape.width * zoomLevel, currentShape.height * zoomLevel, {
            stroke: `${currentShape.strokeColor}`,
            fill: `${currentShape.backgroundColor}`,
            fillStyle: `${currentShape.fillType}`,
            strokeWidth: `${currentShape.strokeWidth}`,
            strokeLineDash: currentShape.strokeStyle,
            roughness: 1,
            seed: currentShape.seed,
            roughness: `${currentShape.slopiness}`,         // Controls how rough the edges are
            bowing: 1,             // Controls the wobbliness of the lines
            curveStepCount: 1000
          });
        }
        else {
          CurvedRectangle(canvasRef, virtualX * zoomLevel, virtualY * zoomLevel, currentShape.width * zoomLevel, currentShape.height * zoomLevel, currentShape.strokeColor,
            currentShape.backgroundColor, currentShape.fillType, currentShape.strokeWidth * zoomLevel, currentShape.slopiness, currentShape.strokeStyle)
        }
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
          seed: currentShape.sh.seed
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
        const { points, strokeColor, strokeWidth, slopiness, strokeStyle, seed } = currentShape;

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
                seed: seed,
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
          seed: currentShape.seed,
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
    // console.log(offsetX, offsetY, zoomLevel)
  }, [allshapes, currentShape, offsetX, offsetY, zoomLevel, undoStack]);
  useEffect(() => {
    const preventHistoryNavigation = (e) => {
      if (
        (e.altKey && (e.key === "ArrowLeft" || e.key === "ArrowRight")) || // Alt + Arrow
        (e.ctrlKey || e.metaKey || e.deltaX !== 0) // Gesture or Horizontal Scroll
      ) {
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", preventHistoryNavigation, { passive: false });
    // window.addEventListener("keydown", preventHistoryNavigation);

    return () => {
      window.removeEventListener("wheel", preventHistoryNavigation);
      // window.removeEventListener("keydown", preventHistoryNavigation);
    };
  }, []);

  useEffect(() => {
    if (!share)
      return
    const handleClickOutside = (event) => {
      if (ShareWidgetRef && ShareWidgetRef.current && !ShareWidgetRef.current.contains(event.target)) {
        console.log("clicked outside")
        setShare(false)
      }
      else
        console.log("clicked inside")
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [share, ShareWidgetRef]);


  const handleWheel = (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Reverse the delta values to move shapes in the same direction as the scroll
    setOffsetX((prevOffsetX) => (prevOffsetX + e.deltaX));
    setOffsetY((prevOffsetY) => (prevOffsetY + e.deltaY));
  };

  function undo() {
    if (undoStack.length < 1) {
      console.log("nothing to undo")
      return;
    }
    console.log("undo called")
    console.log("undo stack", undoStack)
    const secondItem = undoStack[undoStack.length - 2];
    const topItem = undoStack[undoStack.length - 1];
    const temp = [...undoStack]
    temp.pop()
    setUndoStack(temp)
    setAllshapes(secondItem)
    setRedoStack((prev) => [...prev, topItem])
  }
  function redo() {
    if (redoStack.length < 1) {
      console.log("nothing to redo")
      return;
    }
    console.log("redo called")
    console.log("redo stack", redoStack)
    const topItem = redoStack[redoStack.length - 1];
    const temp = [...redoStack]
    temp.pop()
    setRedoStack(temp)
    setAllshapes(topItem)
    setUndoStack((prev) => [...prev, topItem])
  }
  function onZoom(level) {
    const canvas = canvasRef.current;
    const prevZoom = zoomLevel;
    setZoomLevel(prevZoom + level)
    setScale(prevZoom + level)
  }

  return (
    <div>
      {/* <ActionBar tool={tool} setTool={setTool} /> */}
      <ActionBar shape={shape} setShape={setShape} />
      <ShareButton setShare={setShare} sessionActive={sessionActive} notificationCount={clientCount} />
      {share ? <ShareWidget user={user} sessionActive={sessionActive} setSessionActive={setSessionActive} setUser={setUser} socket={socket} setSocket={setSocket} setShareWidgetRef={setShareWidgetRef} /> : <></>}
      {customiser || selected !== 'select' ? <ShapeCustomizer color={color} setColor={setColor} allshapes={allshapes} setAllshapes={setAllshapes} selected={selected} selectedShape={selectedShape} user={user} custom={custom} setCustom={setCustom} shape={shape} /> : <></>}
      <ControlPanel undo={undo} redo={redo} onZoom={onZoom} scale={scale} setScale={setScale} />
      {shape === 'image' && <ImageUpload canvasRef={canvasRef} setAllshapes={setAllshapes} setCurrentShape={setCurrentShape} currentShape={currentShape} user={user} setShape={setShape} />}
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        // style={{ border: '1px solid black' }}

        onMouseDown={(e) => {
          e.preventDefault(); // Prevent default browser behavior
          // e.stopPropagation();  // Stop event propagation
          shape === 'select' ? handleSelectDown(canvasRef, e, currentShape, setCurrentShape, setIsDragging, setDraggingIndex, setStartPos,
            allshapes, setAllshapes, isResizing, setIsResizing, setResizingIndex, resizingIndex, corner, setCorner, shape, setPanning, offsetX, offsetY, zoomLevel, setCustomiser, setCustom, user)
            : shape === 'text' ? handleWriteDown(canvasRef, e, currentShape, setCurrentShape, shape, setShape, allshapes, setAllshapes, font, setFont, offsetX, offsetY, zoomLevel, user, custom, setSelected)
              : shape === "pan" ? handleMouseDownPanning(e, setIsPanDragging, setStartX, setStartY, offsetX, offsetY)
                : handleMouseDown(canvasRef, e, allshapes, setAllshapes, setIsDrawing, setCurrentShape, shape, setShape, offsetX, offsetY, zoomLevel, custom);
        }}

        onTouchStart={(e) => {
          e.preventDefault();
          const touch = e.touches[0]; // Get the first touch
          shape === 'select' ? handleSelectDown(canvasRef, touch, currentShape, setCurrentShape, setIsDragging, setDraggingIndex, setStartPos,
            allshapes, setAllshapes, isResizing, setIsResizing, setResizingIndex, resizingIndex, corner, setCorner, shape, setPanning, offsetX, offsetY, zoomLevel, setCustomiser, setCustom, user)
            : shape === 'text' ? handleWriteDown(canvasRef, touch, currentShape, setCurrentShape, shape, setShape, allshapes, setAllshapes, font, setFont, offsetX, offsetY, zoomLevel, user, custom, setSelected)
              : shape === "pan" ? handleMouseDownPanning(touch, setIsPanDragging, setStartX, setStartY, offsetX, offsetY)
                : handleMouseDown(canvasRef, touch, allshapes, setAllshapes, setIsDrawing, setCurrentShape, shape, setShape, offsetX, offsetY, zoomLevel, custom);
        }}

        onMouseMove={(e) => {
          e.preventDefault();
          e.stopPropagation();
          shape === 'select' ? handleSelectMove(canvasRef, e, startPos, draggingIndex, isDragging, setStartPos, allshapes, setAllshapes,
            isResizing, setIsResizing, resizingIndex, corner, shape, panning, offsetX, offsetY, zoomLevel, box)
            : shape === "pan" ? handleMouseMovePanning(e, isPanDragging, setOffsetX, setOffsetY, startX, startY)
              : handleMouseMove(canvasRef, e, isDrawing, currentShape, setCurrentShape, shape, offsetX, offsetY, zoomLevel);
        }}

        onTouchMove={(e) => {
          e.preventDefault();
          const touch = e.touches[0];
          shape === 'select' ? handleSelectMove(canvasRef, touch, startPos, draggingIndex, isDragging, setStartPos, allshapes, setAllshapes,
            isResizing, setIsResizing, resizingIndex, corner, shape, panning, offsetX, offsetY, zoomLevel, box)
            : shape === "pan" ? handleMouseMovePanning(touch, isPanDragging, setOffsetX, setOffsetY, startX, startY)
              : handleMouseMove(canvasRef, touch, isDrawing, currentShape, setCurrentShape, shape, offsetX, offsetY, zoomLevel);
        }}

        onMouseUp={(e) => {
          e.preventDefault();
          e.stopPropagation();
          shape === 'select' ? handleSelectUp(canvasRef, isDragging, setIsDragging, setDraggingIndex,
            setIsResizing, setResizingIndex, isResizing, panning, setPanning, allshapes, setAllshapes, user)
            : shape === "pan" ? handleMouseUpPanning(setIsPanDragging)
              : handleMouseUp(canvasRef, isDrawing, currentShape, allshapes, setCurrentShape, setAllshapes, setIsDrawing, setShape, user, undoStack, setUndoStack);
        }}

        onTouchEnd={(e) => {
          e.preventDefault();
          const touch = e.changedTouches[0]; // Get the first touch that ended
          shape === 'select' ? handleSelectUp(canvasRef, isDragging, setIsDragging, setDraggingIndex,
            setIsResizing, setResizingIndex, isResizing, panning, setPanning, allshapes, setAllshapes, user)
            : shape === "pan" ? handleMouseUpPanning(setIsPanDragging)
              : handleMouseUp(canvasRef, isDrawing, currentShape, allshapes, setCurrentShape, setAllshapes, setIsDrawing, setShape, user, undoStack, setUndoStack);
        }}

        onWheel={handleWheel}
        onDoubleClick={(e) => handleDoubleClick(canvasRef, e, currentShape, setCurrentShape, shape, setShape, allshapes, setAllshapes, font, setFont, offsetX, offsetY, zoomLevel, user, custom, setSelected)}
      />
    </div>
  );
};

export default RoughCanvas;
