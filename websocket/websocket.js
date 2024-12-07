const WebSocket = require('ws');

// Create WebSocket server on port 8080
const wss = new WebSocket.Server({ port: 8080 });

const rooms = new Map();
function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function (...args) {
        const context = this;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function () {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
}


// Throttled broadcast function
const throttledBroadcast = throttle((user, final_data, isBinary, socket) => {
    const my_room = rooms.get(user)
    const jsonData = JSON.parse(final_data)
    jsonData.clientCount = my_room.size
    const last_data = JSON.stringify(jsonData);
    // console.log("size: ", last_data);

    rooms.get(user).forEach((client) => {
        if (client.readyState === WebSocket.OPEN && socket !== client) {
            client.send(last_data, { binary: isBinary });
        }
    });
}, 10); // Limit to one broadcast every 100ms

wss.on('connection', function connect(socket) {
    socket.on('error', (err) => console.log(err));

    socket.on('message', function message(data, isBinary) {
        const final_data = data.toString();
        const { user, session } = JSON.parse(final_data);
        // if (!session) {
        //     socket.close();
        // }
        console.log("Received message", final_data)
        // Create a new set for the user if they don't have one
        if (!rooms.has(user)) {
            rooms.set(user, new Set());
        }

        // Add the socket to the user's room
        rooms.get(user).add(socket);
        // Use the throttled broadcast function
        throttledBroadcast(user, final_data, isBinary, socket);
    });

    // When the connection closes, remove the socket from the user's room
    socket.on('close', () => {
        // Iterate over each room to find where the socket belongs
        console.log("sesion is closed")
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
