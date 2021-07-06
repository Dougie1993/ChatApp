const express = require('express');
const path = require('path');
const http = require('http');
const socket = require('socket.io');
const formatMessage = require('./utils/messages')
const {userJoin, getCurrentUser, userLeavesChat, getRoomUsers} = require('./utils/users')
//Setting up server to use socket io
const app = express();
const server = http.createServer(app);
const io = socket(server);

const PORT = process.env.PORT || 3000;

const botName = 'ChatApp';
//Setup static folder
app.use(express.static(path.join(__dirname, 'public')));


// Runs when client connects
io.on('connection', socket => {
    socket.on('JoinRoom', ({username, room}) => {
        const user = userJoin(socket.id, username, room); // since we not using db we getting the connection id as the user id
        
        socket.join(user.room); // join the room
        // Send a message to user that has connected- emit is for the current user logged in
        socket.emit('message', formatMessage(botName, 'Welcome to ChatApp'));

        // Broadcast when a user connects to other users -broadcast.emit is for other users except the one that has connected
        /*socket.broadcast.emit('message', formatMessage(botName, 'A user has joined the chat'));*/

        //Broadcast to a certain room
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat'`))

        // Send User and room Information
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
        // To send to all clients in general use io.emit()

    })
    
    //listen for chatMessage
    socket.on('chatMessage', message => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, message)); // remember client is looking for variale called message
    });

    // Runs when client disconnects 
    socket.on('disconnect', () => {
        const user = userLeavesChat(socket.id);
        if(user) {
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));
        }
        //sending room users info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    });

    
})

server.listen(PORT, () => {
    console.log('server running on port ' + PORT);
});