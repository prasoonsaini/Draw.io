// dump.js
import fetch from 'node-fetch';

async function dumpData(client, user) {
    const key = "shapes";
    const userKey = "users"; // Define the user key
    let count = 0;
    try {
        // Fetch all shapes from Redis list
        const shapesList = await client.lRange(key, 0, -1);
        const data = shapesList.map(shape => JSON.parse(shape));

        if (!data.length) {
            console.log('No data found to dump');
            return;
        }

        // Loop through shapes to send each one to MongoDB
        for (const shape of data) {
            if (shape.userId != user)
                continue
            try {
                count++;
                // Attempt to update shape in MongoDB
                let response = await fetch(`http://localhost:3010/api/shapes/${shape.shapeId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(shape),
                });

                // If shape is not found, create it in MongoDB with POST
                if (response.status === 404) {
                    response = await fetch('http://localhost:3010/api/shapes', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(shape),
                    });
                }

                // Check if the request succeeded
                if (!response.ok) {
                    console.log(`Failed to dump shape with ID ${shape.shapeId} to MongoDB.`);
                    continue; // Skip deletion for this shape
                }

                // Only delete shape from Redis if it was successfully dumped
                await client.lRem(key, 1, JSON.stringify(shape)); // Remove this shape from Redis
                console.log(`Successfully dumped and removed shape with ID ${shape.shapeId}`);

            } catch (err) {
                console.error(`Error processing shape with ID ${shape.shapeId}:`, err);
            }
        }

        // Check if all shapes have been removed from the Redis list
        // const remainingShapes = await client.lLen(key);
        // if (count === 0) {
        // Delete the user key if no shapes remain
        // First, retrieve the data before deletion
        // Use lRange to retrieve all elements of the list stored in userKey
        const activeUsersData = await client.lRange(userKey, 0, -1);

        if (!activeUsersData || activeUsersData.length === 0) {
            console.log("No data found for the key:", userKey);
            return;
        }

        // Parse each item if they are JSON strings and store them in an array
        const parsedData = activeUsersData.map(item => JSON.parse(item));
        console.log("Parsed Data:", parsedData);

        // Filter out the user you want to remove
        const updatedUsers = parsedData.filter((userId) => userId !== user);

        // Clear the original list in Redis
        await client.del(userKey);

        // Re-populate the list with updated data
        for (const updatedUser of updatedUsers) {
            await client.rPush(userKey, JSON.stringify(updatedUser));
        }

        // Optionally, log the updated users
        console.log("Updated Users:", updatedUsers);

        console.log('All shapes dumped, user key updated in Redis');

        // }

    } catch (err) {
        console.error('Error during data dump:', err);
    }
}

export default dumpData;
