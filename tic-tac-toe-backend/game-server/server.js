const Express = require('express');
const server = require('http').Server(Express);
const io = require('socket.io')(server, {
    cors: {
        origins: '*'
    }
});

let rooms = [];

io.on('connect', (socket) => {

    socket.on('playerData', (player, cb) => {
        let room = null;
        if(!player.roomId){
            room = createRoom(player);
            console.log(`[Room Created] - (${ room.id }) by ${player.username}`);
            cb({
                joined: true,
                room: room.id,
                message: `[Room Created] - (${ room.id }) by ${ player.username }`
            })
        }
        else {
            room = rooms.find(room => room.id === player.roomId);

            if(room === undefined){
                return;
            }

            console.log(`[Player Joined Room] - (${ room.id }) ${player.username}`);

            cb({
                joined: true,
                room: room.id,
                message: `[Room Joined] - (${ room.id }) ${player.username }`
            })

            room.players.push(player);
        }

        socket.join(room.id);
        io.to(socket.id).emit('joinedRoom', room.id);

        if(room.players.length === 2) {
            io.in(room.id).emit('gameStarting', room.players);
        }
    });

    socket.on('play', (player) => {
        io.in(player.roomId).emit('play', player);
    });

    socket.on('equality', (player) => {
        console.log("eq")
        io.in(player.roomId).emit('equality', player);
    });

    socket.on('replay', (player) => {
        io.in(player.roomId).emit('replay', player);
    });

    socket.on('newGame', (player) => {
        let room = null;
        console.log(player);
        room = rooms.find(room => room.id === player.roomId);
        io.in(room.id).emit('gameStarting', room.players);
    });

    socket.on('endGame', (player) => {
        io.in(player.roomId).emit('endGame', player);
    });

    socket.on('disconnect', () => {
        console.log(`[Disconnect] - ${socket.id}`);

        rooms.forEach(room => {
            room.players.forEach(player => {
                if(player.socketId === socket.id && player.host){
                    rooms = rooms.filter(r => r !== room);
                }
            });
        });
    });
});

function createRoom(player){
    const room = { id: generateRoomId(), players: [] };

    player.roomId = room.id;
    room.players.push(player);
    rooms.push(room);

    return room;
}

function generateRoomId() {
    return Math.random().toString(36).substring(2, 6);
}

server.listen(process.env.PORT | 3000, function() {
    console.log("server started on port :3000...");
})