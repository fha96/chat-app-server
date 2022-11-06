'use strict';
require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const server = http.createServer(app);

const users = {};

const PORT = process.env.PORT ;
app.use(cors({
    origin: 'http://localhost:3000'
}));

const io = new Server(server,{
    cors:{
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    }
});

io.on('connection', (socket) => {
    console.log(`New user connected ${socket.id}`);
    users[socket.id] = socket.id;
    socket.broadcast.emit('new_user_connected', { user : users[socket.id]});
    socket.on('message', (payload) => {
        socket.broadcast.emit('received',{user: users[socket.id], message : payload.message});
    });
    socket.on('disconnect',(payload) => {
        console.log(payload);
        socket.broadcast.emit('user_disconnected',  { disconn: `User has been disconnected ${socket.id}`});
        console.log(users);
        delete users[socket.id];
        console.log(users);
    });

});
server.listen(PORT,() => {
    console.log('Server is listening on PORT: ', PORT);
});