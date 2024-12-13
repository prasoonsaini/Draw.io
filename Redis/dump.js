// dump.js
const fetch = await import('node-fetch');


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
        for (const shape of data) {
            if (shape.userId !== user)
                continue;
            try {
                let response = await fetch(`http://localhost:3010/api/shapes/${shape.shapeId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            }
            catch (err) {
                console.error(`Error deleting shape with ID ${shape.shapeId}:`, err);
            }
        }
        for (const shape of data) {
            if (shape.userId !== user)
                continue;
            try {
                let response = await fetch(`http://localhost:3010/api/shapes`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(shape),
                });
            }
            catch (err) {
                console.error(`Error posting shape with ID ${shape.shapeId}:`, err);
            }
        }
        // ------------ removing the shapes of this user from redis -------
        const shapes = await client.lRange(key, 0, -1);
        const parsedShapes = shapes.map(shape => JSON.parse(shape));
        const filtered_shapes = parsedShapes.filter((e) => {
            if (e.userId !== user) {
                return true;
            }
        })
        console.log("filtered shapes", filtered_shapes)
        await client.del(key);
        // const signal = { userId: user, message: 200 }
        // const strigifiedSignal = JSON.stringify(signal);
        // await client.rPush(key, strigifiedSignal)
        if (filtered_shapes.length > 0) {
            const stringifiedShapes = filtered_shapes.map((shape) => JSON.stringify(shape));
            await client.rPush(key, ...stringifiedShapes);
            console.log(`New key "${key}" created `);
        } else {
            console.log('No values to add to the new key.');
        }


        // ------- removing user entry from key="users" -------------
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
