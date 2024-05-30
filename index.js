const express = require('express');
const app = express();
const { readFile } = require('fs').promises;
const WebSocket = require('ws');
const os = require('os');

function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const net of interfaces[name]) {
            // Skip over non-IPv4 and internal (i.e., 127.0.0.1) addresses
            if (net.family === 'IPv4' && !net.internal) {
                return net.address;
            }
        }
    }
    return '0.0.0.0'; // Return a default value if no address is found
}

const localIP = getLocalIP();

// Serve static files from the 'app' directory
app.use(express.static('app'));

app.get('/', async (request, response) => {
    try {
        const content = await readFile('./app/index.html', 'utf8');
        response.send(content);
    } catch (error) {
        console.error('Error reading index.html:', error);
        response.status(500).send('Server Error');
    }
});

const PORT = process.env.PORT || 3000;
const WS_PORT = process.env.WS_PORT || 8080;

app.listen(PORT, () => console.log(`App available on http://${localIP}:${PORT}`));

let users = [];
let connectedSockets = [];
let connections = [];   
let socketUserpairs = [];

// WebSocket server
const server = new WebSocket.Server({ port: WS_PORT });

server.on('connection', socket => {
    console.log('Client connected.');
    connectedSockets.push(socket);

    socket.on('message', message => {
        try {
            handleMessage(message.toString(), socket);
        } catch (error) {
            console.error('Error handling message:', error);
        }
    });

    socket.on('close', () => {
        console.log('Client disconnected.');
        connectedSockets = connectedSockets.filter(s => s !== socket);
        // Update users list
        broadcastUsers();
    });
});

function handleMessage(message, socket) {
    const action = message.split(':')[0];
    const username = message.split(':')[1];
    if (!username) return;

    if (action === 'open') {
        if (!users.includes(username)) {
            users.push(username);
            socketUserpairs[username] = socket;
            broadcastUsers();
        }
    } else if (action === 'close') {
        users = users.filter(user => user !== username);
        socketUserpairs[username] = null;
        broadcastUsers();
    } else if (action === 'chat') {
        let chatWith = message.split(':')[2];
        connections[username] = chatWith;
        if(connections[chatWith] === username){
            socket.send(`chat:open`);
            socketUserpairs[chatWith].send(`chat:open`);
        }
    } else if (action === 'message') {
        let chatWith = connections[username];
        if(chatWith){
            let rxSocket = socketUserpairs[chatWith];
            if(rxSocket){
                rxSocket.send(`message:${username}:${message.split(':')[3]}`);
            }
        }
    }

}

function broadcastUsers() {
    const usersJson = JSON.stringify(users);
    connectedSockets.forEach(socket => {
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(`users:${usersJson}`);
        }
    });
}
