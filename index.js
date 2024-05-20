const express = require('express');
const app = express();
const { readFile } = require('fs').promises;

app.use(express.static('app'))

app.get('/', async (request, response) => {

    response.send( await readFile('./app/index.html', 'utf8') );

});

app.listen(process.env.PORT || 3000, () => console.log(`App available on http://localhost:3000`))

let users = ["Banana", "Orange", "Apple"];

//Websockets
const WebSocket = require('ws');
const Server = new WebSocket.Server({ port: 8080 });

let connectedSockets = [];

Server.on('connection', socket => {
    console.log('Client connected.');
    connectedSockets.push(socket);
    socket.on('message', message => {
        // Log the message from the client as text
        console.log('Message from client:', message.toString());
        users.push(message.toString());

        const usersJson = JSON.stringify(users);
        connectedSockets.forEach(socket => {
            socket.send(usersJson);
        });
    });
});