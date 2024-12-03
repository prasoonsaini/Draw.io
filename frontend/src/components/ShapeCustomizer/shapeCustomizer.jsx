import CrossHatch from './SVG/cross-hatch';
import Hachure from './SVG/hachure';
import ThinLine from './SVG/line1';
import Thin from './SVG/line1';
import Line1 from './SVG/line1';
import ThickLine from './SVG/line2';
import ThickestLine from './SVG/line3';
import Solid from './SVG/solid';
import './ShapeCustomizer.css';
import Slopiness1 from './SVG/slopiness1';
import Slopiness2 from './SVG/slopiness2';
import Slopiness3 from './SVG/slopiness3';
import PlaneLine from './SVG/planeLine';
import DashedLine from './SVG/dashedLine';
import DottedLine from './SVG/dottedLine';
import Edge from './SVG/edge';
import CurevedEdge from './SVG/curvedEdge';
import Copy from './SVG/copy';
import Delete from './SVG/delete';
import Link from './SVG/Link';
import { useState } from 'react';
import HandWrite from './SVG/handWrite';
import CodeWrite from './SVG/codeWrite';
import NormalWrite from './SVG/normatWrite';
function ShapeCustomizer({ allshapes, setAllshapes, selected, selectedShape, user }) {
    const [selectedButton, setSelectedButton] = useState(null);
    async function changeColor(newColor) {
        const updatedShapes = await Promise.all(
            allshapes.map(async (shape) => {
                if (shape.current) {
                    // Update the color of the selected shape
                    const updatedShape = { ...shape, strokeColor: newColor };
                    try {
                        const response = await fetch(`http://localhost:3020/shapes/${shape.shapeId}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(updatedShape), // Send the shape data
                        });

                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }

                    } catch (error) {
                        console.error('Error updating shape:', error);
                    }
                    return updatedShape;
                }
                return shape;
            })
        );
        setAllshapes(updatedShapes)
    }
    async function changeBackgroundColor(newColor) {
        const updatedShapes = await Promise.all(
            allshapes.map(async (shape) => {
                if (shape.current) {
                    const updatedShape = { ...shape, backgroundColor: newColor };

                    try {
                        const response = await fetch(`http://localhost:3020/shapes/${shape.shapeId}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(updatedShape), // Send the updated shape data
                        });

                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                    } catch (error) {
                        console.error('Error updating shape:', error);
                    }

                    return updatedShape; // Return the updated shape
                }
                return shape; // No change for shapes without `current: true`
            })
        );
        setAllshapes(updatedShapes);
    }

    async function ChangeFillType(fillType) {
        const updatedShapes = await Promise.all(
            allshapes.map(async (shape) => {
                if (shape.current) {
                    const updatedShape = { ...shape, fillType: fillType };
                    try {
                        const response = await fetch(`http://localhost:3020/shapes/${shape.shapeId}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(updatedShape), // Send the updated shape data
                        });

                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                    } catch (error) {
                        console.error('Error updating shape:', error);
                    }

                    return updatedShape; // Return the updated shape
                }
                return shape; // No change for shapes without `current: true`
            })
        );
        setAllshapes(updatedShapes)
    }
    async function strokeWidthChange(width) {
        const updatedShapes = await Promise.all(
            allshapes.map(async (shape) => {
                if (shape.current) {
                    const updatedShape = { ...shape, strokeWidth: width };
                    try {
                        const response = await fetch(`http://localhost:3020/shapes/${shape.shapeId}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(updatedShape), // Send the updated shape data
                        });

                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                    } catch (error) {
                        console.error('Error updating shape:', error);
                    }

                    return updatedShape; // Return the updated shape
                }
                return shape; // No change for shapes without `current: true`
            })
        );
        setAllshapes(updatedShapes)
    }
    async function changeSlopiness(slopiness) {
        const updatedShapes = await Promise.all(
            allshapes.map(async (shape) => {
                if (shape.current) {
                    const updatedShape = { ...shape, slopiness: slopiness };
                    try {
                        const response = await fetch(`http://localhost:3020/shapes/${shape.shapeId}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(updatedShape), // Send the updated shape data
                        });

                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                    } catch (error) {
                        console.error('Error updating shape:', error);
                    }

                    return updatedShape; // Return the updated shape
                }
                return shape; // No change for shapes without `current: true`
            })
        );
        setAllshapes(updatedShapes)
    }
    async function changeStrokeStyle(strokeStyle) {
        const updatedShapes = await Promise.all(
            allshapes.map(async (shape) => {
                if (shape.current) {
                    const updatedShape = { ...shape, strokeStyle: strokeStyle };
                    try {
                        const response = await fetch(`http://localhost:3020/shapes/${shape.shapeId}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(updatedShape), // Send the updated shape data
                        });

                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                    } catch (error) {
                        console.error('Error updating shape:', error);
                    }

                    return updatedShape; // Return the updated shape
                }
                return shape; // No change for shapes without `current: true`
            })
        );
        setAllshapes(updatedShapes)
    }
    const handleButtonClick = (buttonName, onClickCallback) => {
        setSelectedButton(buttonName); // Update selected button state
        onClickCallback(); // Call the original button functionality
    };
    async function handleDelete() {
        // First, iterate over all shapes and delete those where `shape.current` is true
        await Promise.all(allshapes.map(async (shape) => {
            if (shape.current) {
                console.log("shape", shape)
                await fetch(`http://localhost:3020/shapes/${shape.shapeId}`, {
                    method: 'DELETE',
                    headers: {
                        'userId': user
                    }
                });
                return;
            }
        }));

        // Now filter out the shapes where `shape.current` is true
        const temp = allshapes.filter(shape => !shape.current);

        // Update the state with the filtered shapes
        setAllshapes(temp);
    }
    async function handleEdge(curved) {
        const updatedShapes = await Promise.all(
            allshapes.map(async (shape) => {
                if (shape.current) {
                    const updatedShape = { ...shape, curved: curved };
                    try {
                        const response = await fetch(`http://localhost:3020/shapes/${shape.shapeId}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(updatedShape), // Send the updated shape data
                        });

                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                    } catch (error) {
                        console.error('Error updating shape:', error);
                    }

                    return updatedShape; // Return the updated shape
                }
                return shape; // No change for shapes without `current: true`
            })
        );
        console.log("UPdared shaep", updatedShapes)
        setAllshapes(updatedShapes)
    }
    async function ChangeFont(font) {
        const updatedShapes = await Promise.all(
            allshapes.map(async (shape) => {
                if (shape.current) {
                    // Update the color of the selected shape
                    const updatedShape = { ...shape, textFont: font };
                    try {
                        const response = await fetch(`http://localhost:3020/shapes/${shape.shapeId}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(updatedShape), // Send the shape data
                        });

                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }

                    } catch (error) {
                        console.error('Error updating shape:', error);
                    }
                    return updatedShape;
                }
                return shape;
            })
        );
        setAllshapes(updatedShapes)
    }
    const colors = [
        '#1e1e1e', '#e03131', '#2f9e44', '#1971c2',
        '#f08c00', '#726d6c', '#f57b63', '#5bde4b',
        '#92bbf0', '#ecbe9e'
    ];
    const backgroundColors = [
        'grey', '#ffc9c9', '#b2f2bb', '#ffec99', '#92bbf0',
    ];

    return (
        <div className="customizeBar">
            {/* <div> */}
            <div className='combo'>
                <div className='container'>
                    <p>stroke</p>
                </div>
                <div className='color-parent'>
                    {colors.map(color => (
                        <button
                            key={color}
                            className="color"
                            style={{
                                backgroundColor: color,
                                padding: '5px', // Adds space between the border and color
                                border: selectedButton === color ? '2px solid black' : 'none',
                                boxShadow: selectedButton === color ? '0 0 0 1px white inset' : 'none', // Creates the illusion of a gap
                                outline: 'none', // Removes focus outline
                                width: '30px', // Adjusted to maintain consistent size
                                height: '30px',
                            }}
                            onClick={() => handleButtonClick(color, () => changeColor(color))}
                        ></button>
                    ))}
                </div>
            </div>
            {selected === 'text' ? <div className='combo'>
                <div className='container'>
                    <p>font</p>
                </div>
                <div className='color-parent'>
                    <button className='color' style={{ background: selectedButton === 'Handwritten' ? '#7ee4fa' : '' }}
                        onClick={() => handleButtonClick('Handwritten', () => ChangeFont("'Caveat', cursive"))}><HandWrite /></button>
                    <button className='color' style={{ background: selectedButton === 'Normal' ? '#7ee4fa' : '' }}
                        onClick={() => handleButtonClick('Normal', () => ChangeFont("'Roboto', sans-serif"))}><NormalWrite /></button>
                    <button className='color' style={{ background: selectedButton === 'Code' ? '#7ee4fa' : '' }}
                        onClick={() => handleButtonClick('Code', () => ChangeFont("'Fira Code', monospace"))}><CodeWrite /></button>
                </div>
            </div> : <></>}
            {selected !== 'line' && selected !== 'text' ? <div className='combo'>
                <div className='container'>
                    <p>background</p>
                </div>
                <div className='color-parent'>
                    {backgroundColors.map((color) => (
                        <button
                            key={color}
                            className="color"
                            style={{
                                backgroundColor: color,
                                padding: '5px', // Adds space between the border and color
                                border: selectedButton === color ? '2px solid black' : 'none',
                                boxShadow: selectedButton === color ? '0 0 0 1px white inset' : 'none', // Creates the illusion of a gap
                                outline: 'none', // Removes focus outline
                                width: '30px', // Adjusted to maintain consistent size
                                height: '30px',
                            }}
                            onClick={() => handleButtonClick(color, () => changeBackgroundColor(color))}
                        ></button>
                    ))}

                </div>
            </div> : <></>}
            {selected !== 'text' ? <div className='combo'>
                <div className='container'>
                    <p>fill</p>
                </div>
                <div className='color-parent'>
                    <button className='color' style={{ background: selectedButton === 'hachure' ? '#7ee4fa' : '' }}
                        onClick={() => handleButtonClick('hachure', () => ChangeFillType('hachure'))}><Hachure /></button>
                    <button className='color' style={{ background: selectedButton === 'cross-hatch' ? '#7ee4fa' : '' }}
                        onClick={() => handleButtonClick('cross-hatch', () => ChangeFillType('cross-hatch'))}><CrossHatch /></button>
                    <button className='color' style={{ background: selectedButton === 'solid' ? '#7ee4fa' : '' }}
                        onClick={() => handleButtonClick('solid', () => ChangeFillType('solid'))}><Solid /></button>
                </div>
            </div> : <></>}
            {selected !== 'text' ? <div className='combo'>
                <div className='container'>
                    <p>stroke width</p>
                </div>
                <div className='color-parent'>
                    <button className="color" style={{ background: selectedButton === 'ThinLine' ? '#7ee4fa' : '' }}
                        onClick={() => handleButtonClick('ThinLine', () => strokeWidthChange(2))}><ThinLine /></button>
                    <button className="color" style={{ background: selectedButton === 'ThickLine' ? '#7ee4fa' : '' }}
                        onClick={() => handleButtonClick('ThickLine', () => strokeWidthChange(4))}><ThickLine /></button>
                    <button className="color" style={{ background: selectedButton === 'ThickestLine' ? '#7ee4fa' : '' }}
                        onClick={() => handleButtonClick('ThickestLine', () => strokeWidthChange(6))}><ThickestLine /></button>
                </div>
            </div> : <></>}
            {selected !== 'text' ? <div className='combo'>
                <div className='container'>
                    <p>stroke style</p>
                </div>
                <div className='color-parent'>
                    <button className="color" style={{ background: selectedButton === 'PlaneLine' ? '#7ee4fa' : '' }}
                        onClick={() => handleButtonClick('PlaneLine', () => changeStrokeStyle([0, 0]))}><PlaneLine /></button>
                    <button className="color" style={{ background: selectedButton === 'DashedLine' ? '#7ee4fa' : '' }}
                        onClick={() => handleButtonClick('DashedLine', () => changeStrokeStyle([8, 10]))}><DashedLine /></button>
                    <button className="color" style={{ background: selectedButton === 'DottedLine' ? '#7ee4fa' : '' }}
                        onClick={() => handleButtonClick('DottedLine', () => changeStrokeStyle([1, 5]))}><DottedLine /></button>
                </div>
            </div> : <></>}
            {selected !== 'text' ? <div className='combo'>
                <div className='container'>
                    <p>slopiness</p>
                </div>
                <div className='color-parent'>
                    <button className="color" style={{ background: selectedButton === 'Slopiness1' ? '#7ee4fa' : '' }}
                        onClick={() => handleButtonClick('Slopiness1', () => changeSlopiness(1))}><Slopiness1 /></button>
                    <button className="color" style={{ background: selectedButton === 'Slopiness2' ? '#7ee4fa' : '' }}
                        onClick={() => handleButtonClick('Slopiness2', () => changeSlopiness(1.5))}><Slopiness2 /></button>
                    <button className="color" style={{ background: selectedButton === 'Slopiness3' ? '#7ee4fa' : '' }}
                        onClick={() => handleButtonClick('Slopiness3', () => changeSlopiness(2))}><Slopiness3 /></button>
                </div>
            </div> : <></>}
            {selected === 'rec' ? <div className='combo'>
                <div className='container'>
                    <p>edges</p>
                </div>
                <div className='color-parent'>
                    {/* <button onClick={() => handleEdge(false)}><Edge /></button>
                    <button onClick={() => handleEdge(true)}><CurevedEdge /></button> */}
                    <button className='color' style={{ background: selectedButton === 'edge' ? '#7ee4fa' : '' }}
                        onClick={() => handleButtonClick('edge', () => handleEdge(false))}><Edge /></button>
                    <button className='color' style={{ background: selectedButton === 'curve' ? '#7ee4fa' : '' }}
                        onClick={() => handleButtonClick('curve', () => handleEdge(true))}><CurevedEdge /></button>
                </div>
            </div> : <></>}
            <div className='combo'>
                <div className='container'>
                    <p>Actions</p>
                </div>
                <div className='color-parent'>
                    <Copy />
                    <button onClick={() => handleDelete()} ><Delete /></button>
                    <Link />
                </div>
            </div>
            {/* </div> */}
        </div>
    );
}

export default ShapeCustomizer;
