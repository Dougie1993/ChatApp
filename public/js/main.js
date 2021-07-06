const chatForm = document.getElementById('chat-form'); 
const chatMessages = document.querySelector('.chat-messages'); // targeting by class
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users')
//Get user name and room from url- we added the qs library
const { username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix : true
});

const socket = io(); // we have access to it because of the script tag

// Join Chat Room
socket.emit('JoinRoom', {username, room});

// Get Room and users
socket.on('roomUsers', ({room,users}) => {
    //Dom related 
    outPutRoomName(room);
    outPutUsers(users);
})

socket.on('message', message => {
    // This gets whatever the message is from BE
    // captures emmited message
    sendMessage(message);

    // Scroll Down
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

// Message Submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault(); //prevent form saving to file

    // Get message text
    let message = e.target.elements.msg.value;

    //Emit the message to the server
    socket.emit('chatMessage', message);

    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
})

// Helper Methods

function sendMessage(message) {
    const div = document.createElement('div'); // create a div
    div.classList.add('message');// add class message to div
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`; 
    document.querySelector('.chat-messages').appendChild(div);
}

// Add roomname to DOM
function outPutRoomName(room) {
    roomName.innerText = room;
}

// Add users to DOM
function outPutUsers(users) {
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}