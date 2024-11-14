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
function ShapeCustomizer({ allshapes, setAllshapes, selected, selectedShape, user }) {
    const [selectedButton, setSelectedButton] = useState(null);
    async function changeColor(newColor) {
        const updatedShapes = await Promise.all(
            allshapes.map(async (shape) => {
                if (shape.current) {
                    // Update the color of the selected shape
                    const updatedShape = { ...shape, strokeColor: newColor };
                    try {
                        const response = await fetch(`http://localhost:3010/api/shapes/${shape.shapeId}`, {
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
                        const response = await fetch(`http://localhost:3010/api/shapes/${shape.shapeId}`, {
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
                        const response = await fetch(`http://localhost:3010/api/shapes/${shape.shapeId}`, {
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
                        const response = await fetch(`http://localhost:3010/api/shapes/${shape.shapeId}`, {
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
                        const response = await fetch(`http://localhost:3010/api/shapes/${shape.shapeId}`, {
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
                        const response = await fetch(`http://localhost:3010/api/shapes/${shape.shapeId}`, {
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


    return (
        <div className="customizeBar">
            {/* <div> */}
            <div className='combo'>
                <div className='container'>
                    <p>stroke</p>
                </div>
                <div className='color-parent'>
                    <button className='color' style={{ backgroundColor: '#1e1e1e', }} onClick={() => { changeColor('#1e1e1e') }}></button>
                    <button className='color' style={{ backgroundColor: '#e03131', }} onClick={() => { changeColor('#e03131') }}></button>
                    <button className='color' style={{ backgroundColor: '#2f9e44', }} onClick={() => { changeColor('#2f9e44') }}></button>
                    <button className='color' style={{ backgroundColor: '#1971c2', }} onClick={() => { changeColor('#1971c2') }}></button>
                    <button className='color' style={{ backgroundColor: '#f08c00', }} onClick={() => { changeColor('#f08c00') }}></button>
                    <button className='color' style={{ backgroundColor: '#726d6c', }} onClick={() => { changeColor('#726d6c') }}></button>
                    <button className='color' style={{ backgroundColor: '#f57b63', }} onClick={() => { changeColor('#f57b63') }}></button>
                    <button className='color' style={{ backgroundColor: '#5bde4b', }} onClick={() => { changeColor('#5bde4b') }}></button>
                    <button className='color' style={{ backgroundColor: '#92bbf0', }} onClick={() => { changeColor('#92bbf0') }}></button>
                    <button className='color' style={{ backgroundColor: '#ecbe9e', }} onClick={() => { changeColor('#ecbe9e') }}></button>
                </div>
            </div>
            {selected != 'line' ? <div className='combo'>
                <div className='container'>
                    <p>background</p>
                </div>
                <div className='color-parent'>
                    <button className='color' style={{ backgroundColor: 'grey', }} onClick={() => { changeBackgroundColor('grey') }}></button>
                    <button className='color' style={{ backgroundColor: '#ffc9c9', }} onClick={() => { changeBackgroundColor('#ffc9c9') }}></button>
                    <button className='color' style={{ backgroundColor: '#b2f2bb', }} onClick={() => { changeBackgroundColor('#b2f2bb') }}></button>
                    <button className='color' style={{ backgroundColor: '#b2f2bb', }} onClick={() => { changeBackgroundColor('#b2f2bb') }}></button>
                    <button className='color' style={{ backgroundColor: '#ffec99', }} onClick={() => { changeBackgroundColor('#ffec99') }}></button>
                </div>
            </div> : <></>}
            <div className='combo'>
                <div className='container'>
                    <p>fill</p>
                </div>
                <div className='color-parent'>
                    <button className='color' onClick={() => { ChangeFillType('hachure') }}><Hachure /></button>
                    <button className='color' onClick={() => { ChangeFillType('cross-hatch') }}><CrossHatch /></button>
                    <button className='color' onClick={() => { ChangeFillType('solid') }}><Solid /></button>
                </div>
            </div>
            <div className='combo'>
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
            </div>
            <div className='combo'>
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
            </div>
            <div className='combo'>
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
            </div>
            {selected === 'rec' ? <div className='combo'>
                <div className='container'>
                    <p>edges</p>
                </div>
                <div className='color-parent'>
                    <Edge />
                    <CurevedEdge />
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
