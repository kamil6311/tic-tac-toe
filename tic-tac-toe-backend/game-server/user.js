const users = [];

function getUser(socketId) {
    return users.find(user => user.id === socketId);
}

function isUsernameTaken(username) {
    var resultat = false;

    users.forEach(user => {
        if(user.username.toLowerCase() === username.toLowerCase()){
            resultat = true;
        }
        else{
            resultat = false;
        }
    });

    return resultat;
}

function userJoin(socketId, username, room){
    const user = {id: socketId, username: username, room: room, cases: [] };
    users.push(user);
}

function userLeft(username){
    users.filter(user => user.username !== username);
}

function isRoomFull(roomId) {
    const resultat = false;
    var count = 0;

    users.forEach(user => {
        if(count < 3){
            if(user.room == roomId){
                count = count +1;
            }
        }
        else{
            resultat = true;
        }
    })
    return resultat;
}

module.exports = {
    getUser,
    isUsernameTaken,
    userJoin,
    isRoomFull,
    userLeft
}