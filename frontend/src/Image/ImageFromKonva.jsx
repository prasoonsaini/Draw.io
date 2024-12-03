import React, { useState, useEffect } from 'react';
import { Stage, Layer, Image } from 'react-konva';

const ImageApp = () => {
    const [image, setImage] = useState(null);

    useEffect(() => {
        const img = new window.Image();
        img.src = 'https://konvajs.org/assets/yoda.jpg'; // Image URL
        img.onload = () => {
            setImage(img);
        };
    }, []);

    return (
        <Stage width={window.innerWidth} height={window.innerHeight}>
            <Layer>
                {image && (
                    <Image
                        image={image}
                        x={50}
                        y={50}
                        width={200}
                        height={200}
                        draggable
                    />
                )}
            </Layer>
        </Stage>
    );
};

export default ImageApp;
