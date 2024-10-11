const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const route = require('./route');
const {addUser, findUser, getRoomUsers, removeUser } = require('./users');

const app = express();

app.use(cors({ origin: '*' }));
app.use(route);

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

/**
 * Handles socket connection events.
 * @param {Socket} socket - The socket connection object.
 */
io.on('connection', (socket) => {

    /**
     * Handles User joining a room.
     * @param {Object} data - The data containing name and room.
     * @param {string} data.name - The name of the user.
     * @param {string} data.room - The room to join.
     */
    socket.on('join', ({name, room}) => {
        socket.join(room);

        const { user, isExist } = addUser({name, room});

        const userMessage = isExist ? `${user.name}, welcome back!`
            : `Hello, ${user.name}`;

        socket.emit('message', {
            data: { user: { name: 'Admin'}, message: userMessage },
        });

        socket.broadcast.to(user.room).emit('message', {
            data: { user: { name: 'Admin'}, message: `${user.name} has joined` },
        });
        io.to(user.room).emit('room', {
            data: { users: getRoomUsers(user.room) },
        });
    });

    /**
     * Handles sending messages to a room.
     * @param {Object} data - The data containing message and parameters.
     * @param {string} data.message - The message to send.
     * @param {Object} data.params - The user parameters to find the user.
     */
    socket.on('sendMessage', ({ message, params }) => {
        const user = findUser(params);
        if (user) {
            io.to(user.room).emit('message', { data: { user, message }});
        }

    });

    /**
     * Handles user leaving a room.
     * @param {Object} params - The user parameters to identify the user.
     */
    socket.on('leftRoom', ({ params }) => {
        const user = removeUser(params);
        if (user) {
            const { room, name } = user;

            io.to(room).emit('message', {
                data: { user: { name: 'Admin' }, message: `${name} has left the room` },
            });

            io.to(room).emit('room', {
                data: { users: getRoomUsers(room) },
            });
        }
    });

    io.on('disconnect', () => {
        console.log('Disconnect');
    });
});

server.listen(5003, () => {
    console.log('Server is running!');
});