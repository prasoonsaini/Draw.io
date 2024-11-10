const WebSocket = require('ws');

// Create WebSocket server on port 8080
const wss = new WebSocket.Server({ port: 8080 });

// Broadcast message to all connected clients
function broadcast(data, sender) {
    const parsedData = data.toString();
    console.log("sent data", parsedData);
    wss.clients.forEach(function each(client) {
        if (client !== sender && client.readyState === WebSocket.OPEN) {
            client.send(parsedData);  // Broadcast the data to all clients except the sender
        }
    });
}

// Function to print all connected clients
function printAllClients() {
    console.log('Current connected clients:');
    wss.clients.forEach(client => {
        console.log(client._socket.remoteAddress + ':' + client._socket.remotePort);
    });
}

wss.on('connection', (ws) => {
    console.log('A new client connected');
    printAllClients();  // Print all clients when a new client connects

    // Listen for messages from the client
    ws.on('message', (message) => {
        const parsedMessage = message.toString();
        console.log('Received message:', parsedMessage);
        broadcast(parsedMessage, ws);  // Broadcast the message to other clients
    });

    // Handle disconnection
    ws.on('close', () => {
        console.log('Client disconnected');
        printAllClients();  // Print all clients when a client disconnects
    });
});

console.log('WebSocket server is running on ws://localhost:8080');
