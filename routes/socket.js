var users = (function () {

    var users = {};

    var getUsers = function(){
        return [
                    {name:"Guest 1", uid:1},
                    {name:"Guest 2", uid:2},
                    {name:"Guest 3", uid:3}
                ]
    }

    return {
        getUsers: getUsers
    }

}());

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

    var newConnection = function (socketId,name) {
        if (!socketId || connections[socketId]) {
            return false;
        } else {
            connections[socketId] = {socketId:socketId, name:name};
            return true;
        }
    };

    var killConnection = function (socketId) {
        if (connections[socketId]) {
            delete connections[socketId];
        }
    };

    // serialize claimed names as an array
    var getConnections = function (socketId) {
        var res = [];
        for (var connection in connections) {
            if(socketId !== connection){
                var c = connections[connection];
                res.push(c);
            }
        }

        return res;
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
        getConnections: getConnections
    };
}());


// export function for listening to the socket
module.exports = function (socket) {

    var name = socketConnections.getGuestName();
    socketConnections.newConnection(socket.id, name);

    socket.emit('user:connect', {
                                    name: name,
                                    socketId: socket.id,
                                    connections: socketConnections.getConnections(socket.id)
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
        var receiverSocketId = socketConnections.getSocketId(data.receiverName)
        global.io.sockets.socket(receiverSocketId).emit('user:msg', {
            emitterName: data.emitterName,
            msg: data.msg
        });
    });

};