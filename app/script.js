let username;
let connectedWith;
let isChatOpen = false;
while (!username || !username.match(/^[a-zA-Z0-9]+$/)) {
    //username = prompt("Enter a Username");
    username = "test"
    if(!username) {
        alert('Username is required to connect.');
        continue;
    }
    if (!username.match(/^[a-zA-Z0-9]+$/)) {
        alert('Username must contain only letters and numbers.');
    }
    
}


const socket = new WebSocket(`ws://${window.location.hostname}:8080`);

socket.onopen = () => {
    console.log('Connection is open!');
    socket.send(`open:${username}`);
};

function handleMessage(message, socket) {
    const action = message.split(':')[0];
    const username = message.split(':')[1];
    if (!username) return;

    if (action === 'open') {
        if (!users.includes(username)) {
            users.push(username);
            broadcastUsers();
        }
    } else if (action === 'close') {
        users = users.filter(user => user !== username);
        broadcastUsers();
    } else if (action === 'chat') {
        let chatWith = message.split(':')[2];
        connections[username] = chatWith;
        if(connections[chatWith] === username){
            socket.send(`chat:open`);
        }
    }

}

socket.onmessage = ({ data }) => {
    console.log('Message from server:', data);
    const action = data.split(':')[0];
    if (action === 'users') {
        const usersDiv = document.getElementById('users');
        let users = JSON.parse(data.split(':')[1]);
        users = users.filter(user => user !== username);
        usersDiv.innerHTML = users.map(user => `<div class="user"  onclick="connectToUser(this)"><span class="username" >${user}</span></div>`).join('');
        //change the color of the user that is connected with
        if(connectedWith){
            let userElement = document.getElementsByClassName('username');
            for(let i = 0; i < userElement.length; i++){
                if(userElement[i].innerHTML === connectedWith){
                    if(!isChatOpen)
                        userElement[i].parentElement.style.backgroundColor = 'rgb(66 175 228)';
                    else
                    userElement[i].parentElement.style.backgroundColor = 'rgb(15 217 30)';
                    clickedUserElement = userElement[i].parentElement;
                }
            }
        }
    } else if (action === 'chat') {
        if(data.split(':')[1] === 'open'){
            console.log('Chat is open!');
            isChatOpen = true;
            if(clickedUserElement)
                clickedUserElement.style.backgroundColor = 'rgb(15 217 30)';
        }
    } else if (action === 'message') {
        const message = data.split(':')[2];
        const chatBox = document.getElementById('chatBox');
        chatBox.innerHTML += `<div class="gotMessageContainer"><span class="gotMessage">${message}</span></div>`;
    }
};

window.onbeforeunload = () => {
    socket.send(`close:${username}`);
    socket.close();
    console.log('Connection is closed!');
};

socket.onerror = (error) => {
    console.error('WebSocket error:', error);
};


window.addEventListener('DOMContentLoaded', () => { 
    const chatPromt = document.getElementById('chatPromt');
    const chatBox = document.getElementById('chatBox');
    chatPromt.onkeyup = (event) => {
        if (event.key === 'Enter') {
            if (!chatPromt.value) {
                return;
            }
            if(isChatOpen){
                chatBox.innerHTML += `<div class="sentMessageContainer"><span class="sentMessage">${chatPromt.value}</span></div>`;
                socket.send(`message:${username}:${connectedWith}:${chatPromt.value}`);
                chatPromt.value = '';
            }
        }
    }

    document.getElementById('menuButton').addEventListener('click', function() {
        const usersContainer = document.getElementById('usersContainer');
        if (usersContainer.style.left === '-270px') {
            usersContainer.style.left = '0px';
        } else {
            usersContainer.style.left = '-270px';
        }
    });

    
});

let clickedUserElement;

//users onclick
function connectToUser(element){
    console.log(`Connecting with ${element.childNodes[0].innerHTML}!`);
    socket.send(`chat:${username}:${element.childNodes[0].innerHTML}`);
    connectedWith = element.childNodes[0].innerHTML;
    element.style.backgroundColor = 'rgb(66 175 228)';
    if(clickedUserElement)
        clickedUserElement.style.backgroundColor = 'rgb(77, 77, 77)';
    clickedUserElement = element;
    document.getElementById('chatBoxHeaderText').innerHTML = `Chat with ${connectedWith}`;
    isChatOpen = false;
}