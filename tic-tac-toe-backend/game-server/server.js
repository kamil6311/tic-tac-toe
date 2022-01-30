const Express = require('express');
const server = require('http').Server(Express);
const io = require('socket.io')(server, {
    cors: {
        origins: '*'
    }
});

const { getUser, isUsernameTaken, userJoin, isRoomFull, userLeft } = require('./user');


io.on('connect', (socket) => {
    socket.on('message', (data) => {
        io.in(data.room).emit('message', { user: data.username, message: data.message });
    })

    socket.on('join', function (data, cb) {
        if(isUsernameTaken(data.username) === true){
            cb({
                message: 'user with username ' + data.username + ' already exists'
            }); 
        }
        else{
            userJoin(socket.id, data.username, data.room);
            socket.join(data.room);
            console.log(data.username + " joined room: " + data.room);
            cb({
                message: 'succesfully joined room ' + data.room
            }); 
            io.in(data.room).emit('roomMessage', { username: data.username, message: 'has joined the room' });
        }

        socket.on('leave', function(data){
            console.log('user ' + data.username + ' has left the room ' + data.room);
            io.in(data.room).emit('userLeft', {user: data.username, room: data.room, message: 'user left room'});
            socket.leave(data.room);
            userLeft(data.username)
        });
    })

})

server.listen(3000, function() {
    console.log("server started on port :3000...");
})