const Express = require('express');
const server = require('http').Server(Express);
const io = require('socket.io')(server, {
    cors: {
        origins: '*'
    }
});

const { getUser, isUsernameTaken, userJoin, isRoomFull, userLeft, getPlayersRoom } = require('./user');


io.on('connect', (socket) => {
    socket.on('message', (data) => {
        io.in(data.room).emit('message', { user: data.username, message: data.message, room: data.room });
    })

    socket.on('getNbPlayersRoom', function(data, cb) {
        cb({
            nbPlayers: getPlayersRoom(data.room)
        })
    })

    socket.on('join', function (data, cb) {
        if(isUsernameTaken(data.username) === true){
            cb({
                message: 'user with username ' + data.username + ' already exists'
            }); 
        }
        else{
            if(getPlayersRoom(data.room) > 1){
                cb({
                    joined: false,
                    message: 'This party is full'
                }); 
            }
            else{
                userJoin(socket.id, data.username, data.room);
                socket.join(data.room);
                console.log(data.username + " joined room: " + data.room);
                cb({
                    joined: true,
                    message: 'succesfully joined room ' + data.room
                }); 
                io.in(data.room).emit('message', { username: data.username,  message: 'has joined the room', room: data.room, });
            }
        }

        socket.on('endGame', function(data){
            userLeft(data.username);
            console.log("ending game");
        });
    })
})

server.listen(3000, function() {
    console.log("server started on port :3000...");
})