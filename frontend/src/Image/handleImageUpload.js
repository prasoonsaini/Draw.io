const handleImageUpload = async (event, canvasRef, setAllshapes, setCurrentShape, currentShape, user, setShape) => {
    console.log("this is the user in handle upload fucntion", user)
    const file = event.target.files[0];
    setShape('select')
    if (!file) {
        console.error("No file selected.");
        return;
    }

    const imgToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result); // Base64 string
            reader.onerror = () => reject("Failed to read file.");
            reader.readAsDataURL(file);
        });
    };

    try {
        const base64Image = await imgToBase64(file);

        const img = new Image();
        img.onload = async () => {
            const ctx = canvasRef.current?.getContext("2d");
            if (!ctx) {
                console.error("Canvas context is not available.");
                return;
            }

            // Position and scaling logic
            const x = 500;
            const y = 500;
            const maxWidth = canvasRef.current.width / 2;
            const maxHeight = canvasRef.current.height / 2;
            const scale = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
            const width = img.width * scale;
            const height = img.height * scale;

            // Create the shape object

            const formData = new FormData();
            formData.append("image", file);

            try {
                const response = await fetch("http://localhost:3030/upload", {
                    method: "POST",
                    body: formData,
                });

                const data = await response.json(); // Get the uploaded image URL
                const imageUrl = data.url;
                console.log("image url is this", imageUrl)
                // Create the shape object with the image URL
                const newImageShape = {
                    shape: "image",
                    imageUrl, // Set the uploaded image URL
                    x: 500, // Example X position
                    y: 500, // Example Y position
                    width: 200, // Example width
                    height: 200, // Example height
                    current: true,
                    strokeColor: "black",
                    backgroundColor: "transparent",
                    fillType: "solid",
                    strokeWidth: 1,
                    slopiness: 0.5,
                    strokeStyle: [0, 0],
                    curved: true,
                    shapeId: Math.floor(Math.random() * 100000),
                    userId: user
                };

                // Update the state
                setCurrentShape(newImageShape);
                setAllshapes((prevShapes) => [...prevShapes, newImageShape]);
                // Save shape data to backend
                try {
                    const response = await fetch(`http://localhost:3010/api/shapes`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(newImageShape),
                    });

                    if (!response.ok) {
                        console.error("Failed to save shape data:", response.statusText);
                    } else {
                        console.log("Shape data saved successfully.");
                    }
                } catch (error) {
                    console.error("Error saving shape data:", error);
                }
            } catch (error) {
                console.error("Error uploading image:", error);
            }


        };

        img.onerror = () => console.error("Failed to load the image.");
        img.src = base64Image;
    } catch (error) {
        console.error("Error converting image to Base64:", error);
    }
};

// Usage remains the same, ensure caching avoids creating new Image objects unnecessarily.
export default handleImageUpload;