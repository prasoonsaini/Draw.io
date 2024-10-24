const WebSocket = require('ws');

// Create WebSocket server on port 8080
const wss = new WebSocket.Server({ port: 8080 });

// Broadcast message to all connected clients
function broadcast(data, sender) {
    wss.clients.forEach(function each(client) {
        if (client !== sender && client.readyState === WebSocket.OPEN) {
            client.send(data);  // Broadcast the data to all clients except the sender
        }
    });
}

wss.on('connection', (ws) => {
    console.log('A new client connected');

    // Listen for messages from the client
    ws.on('message', (message) => {
        console.log('Received message:', message);
        broadcast(message, ws);  // Broadcast the message to other clients
    });

    // Handle disconnection
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log('WebSocket server is running on ws://localhost:8080');
