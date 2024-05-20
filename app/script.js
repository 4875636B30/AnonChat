const socket = new WebSocket('ws://192.168.0.45:8080');

socket.onopen = () => {
    console.log('Connection is open!');
    socket.send('User1');
};

let usersOnWebsiteUsers = [];

socket.onmessage = ({ data }) => {
    console.log('Message from server:', data);
    let usersDiv = document.getElementById('users');
    let users = JSON.parse(data);
    users.forEach(element => {
        if (!usersOnWebsiteUsers.includes(element)) {
            usersOnWebsiteUsers.push(element);
            usersDiv.innerHTML += `<div class="user"><span class="username">${element}</span></div>`;
    }
    });
}