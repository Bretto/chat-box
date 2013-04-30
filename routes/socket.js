


//var users = (function () {
//
//    var usersDico = {};
//    users[1] = {name:"Guest 1", id:1, annonces:[1,2,3]};
//
//    var getUsersArr = function(){
//        var usersArr = [];
//        for (var userId in usersDico) {
//           var user = usersDico[userId];
//            usersArr.push(user);
//        }
//        return usersArr;
//    }
//
//    var getUsersDico = function(){
//        return usersDico;
//    }
//
//    return {
//        getUsersArr: getUsersArr,
//        getUsersDico: getUsersDico
//    }
//
//}());


//var chatRooms = (function () {
//
//    var chatRooms = {};
//    chatRooms[1|1|2] = ;
//    chatRooms[2] = {name:"Guest 2", id:2, annonceId:2};
//    chatRooms[3] = {name:"Guest 3", id:3, annonceId:3};
//
//    var getUsersArr = function(){
//        var usersArr = [];
//        for (var userId in usersDico) {
//            var user = usersDico[userId];
//            usersArr.push(user);
//        }
//        return usersArr;
//    }
//
//    var getUsersDico = function(){
//        return usersDico;
//    }
//
//    return {
//        getUsersArr: getUsersArr,
//        getUsersDico: getUsersDico
//    }
//
//}());




var socketConnections = (function () {
    var connections = {};
    var names = {};

    var claim = function (name) {
        if (!name || names[name]) {
            return false;
        } else {
            names[name] = {name:name};
            return true;
        }
    };

    var freeName = function (name) {
        if (names[name]) {
            delete names[name];
        }
    };

    // find the lowest unused "guest" name and claim it
    var getGuestName = function () {
        var name,
            nextUserId = 1;

        do {
            name = 'Guest ' + nextUserId;
            nextUserId += 1;
        } while (!claim(name));

        return name;
    };

    var newConnection = function(socketId,name) {
        if (!socketId || connections[socketId]) {
            return false;
        } else {
            connections[socketId] = {socketId:socketId, name:name, chatEnable:false};
            return true;
        }
    };

    var killConnection = function(socketId) {
        if (connections[socketId]) {
            delete connections[socketId];
        }
    };

    var getConnectionsArray = function(socketId) {
        var res = [];
        for (var connection in connections) {
            if(socketId !== connection){
                var c = connections[connection];
                res.push(c);
            }
        }
        return res;
    };

    var getConnectionsDico = function() {
        return connections;
    };

    var getSocketId = function(name){
        var sId = null;
        for (var socketId in connections) {
            var connection = connections[socketId];
            if(connection.name === name){
                sId = connection.socketId;
                return sId;
            }
        }
        return sId;
    }

    return {
        getSocketId: getSocketId,
        getGuestName: getGuestName,
        newConnection: newConnection,
        killConnection: killConnection,
        freeName: freeName,
        getConnectionsArray: getConnectionsArray,
        getConnectionsDico: getConnectionsDico
    };
}());


// export function for listening to the socket
module.exports = function (socket) {

    var name = socketConnections.getGuestName();
    socketConnections.newConnection(socket.id, name);

    var connectionsArr = socketConnections.getConnectionsArray(socket.id);

    socket.emit('user:connect', {
                                    name: name,
                                    socketId: socket.id,
                                    connections: connectionsArr
                                });

    // notify other clients that a new user has joined
    socket.broadcast.emit('user:join', {socketId: socket.id, name: name});

    // clean up when a user leaves, and broadcast it to other users
    socket.on('disconnect', function () {
        socket.broadcast.emit('user:disconnect', {socketId: socket.id});
        socketConnections.killConnection(socket.id);
        socketConnections.freeName(name);
    });

    socket.on('user:msg', function (data) {
        var receiverSocketId = socketConnections.getSocketId(data.receiverName);
        var connectionsDico = socketConnections.getConnectionsDico();
        var connection = connectionsDico[receiverSocketId];
        if(connection.chatEnable){
            global.io.sockets.socket(receiverSocketId).emit('user:msg', {
                emitterName: data.emitterName,
                msg: data.msg
            });
        }
    });

    socket.on('user:chatEnable', function (data) {
        var receiverSocketId = socketConnections.getSocketId(data.userId);
        var connectionsDico = socketConnections.getConnectionsDico();
        var connection = connectionsDico[receiverSocketId];
        connection.chatEnable = data.chatEnable;
    });



};