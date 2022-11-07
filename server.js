'use strict';
require('dotenv').config();

const {PORT, Server, app, cors, http} =require('./config');
const queue = require('./message-queue');
const server = http.createServer(app);
const users = {};

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
        queue.push(payload.message);
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