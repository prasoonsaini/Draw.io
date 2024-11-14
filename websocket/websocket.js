const WebSocket = require('ws');

// Create WebSocket server on port 8080
const wss = new WebSocket.Server({ port: 8080 });

const rooms = new Map();

wss.on('connection', function connect(socket) {
    socket.on('error', (err) => console.log(err));
    console.log("Roooms", rooms)
    socket.on('message', function message(data, isBinary) {
        const final_data = data.toString();
        const { user, session } = JSON.parse(data.toString());

        // Create a new set for the user if they don't have one
        if (!rooms.has(user)) {
            rooms.set(user, new Set());
        }

        // Add the socket to the user's room
        rooms.get(user).add(socket);

        // Broadcast the message to all clients in the same room
        rooms.get(user).forEach((client) => {
            if (client.readyState === WebSocket.OPEN && socket !== client) {
                client.send(final_data, { binary: isBinary });
            }
        });
    });

    // When the connection closes, remove the socket from the user's room
    socket.on('close', () => {
        // Iterate over each room to find where the socket belongs
        for (const [user, clients] of rooms.entries()) {
            if (clients.has(socket)) {
                clients.delete(socket); // Remove the socket from the room
                // If the room is empty, delete the room
                if (clients.size === 0) {
                    rooms.delete(user);
                }
                break;
            }
        }
    });

    console.log("Hello from server!");
});

console.log('WebSocket server is running on ws://localhost:8080');
