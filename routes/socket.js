


var users = (function () {

    var usersDico = {};

    var getUsersArr = function(){
        var usersArr = [];
        for (var userId in usersDico) {
           var user = usersDico[userId];
            usersArr.push(user);
        }
        return usersArr;
    }

    var getUsersDico = function(){
        return usersDico;
    }

    var destroy = function(id){
        if (usersDico[id]) {
            delete usersDico[id];
        }
    }

    return {
        getUsersArr: getUsersArr,
        getUsersDico: getUsersDico,
        destroy:destroy
    }

}());



// Keep track of which names are used so that there are no duplicates
var userNames = (function () {
    var names = {};

    var claim = function (name) {
        if (!name || names[name]) {
            return false;
        } else {
            names[name] = true;
            return true;
        }
    };

    // find the lowest unused "guest" name and claim it
    var getUser = function () {
        var user = {name:'', id:0},
            name,
            nextUserId = 1;

        do {
            name = 'Guest ' + nextUserId;
            user.id = nextUserId;
            user.name = name;
            nextUserId += 1;
        } while (!claim(name));

        return user;
    };

    // serialize claimed names as an array
    var get = function () {
        var res = [];
        for (user in names) {
            res.push(user);
        }

        return res;
    };

    var free = function (name) {
        if (names[name]) {
            delete names[name];
        }
    };

    return {
        claim: claim,
        free: free,
        get: get,
        getUser: getUser
    };
}());


// export function for listening to the socket
module.exports = function (socket) {

    var user = userNames.getUser();
    user.sId = socket.id;
    var usersDico = users.getUsersDico();
    usersDico[user.id] = user;

    socket.emit('user:connect', user);

    socket.on('joinChatRoom', function(data){
        socket.join(data.roomId);
    });


    socket.on('user:msg', function (data) {

        var tUser = usersDico[data.tId];
        var sId = tUser.sId;

        //if client and vendor are in the room send msg
        if(global.io.sockets.clients(data.roomId).length === 2){
            socket.broadcast.to(data.roomId).emit('user:msg', data);
        }
        //else send a msgAlert to vendor
        else{
            global.io.sockets.socket(sId).emit('msgAlert', data);
        }
    });

//    socket.on('user:chatEnable', function (data) {
//        var receiverSocketId = socketConnections.getSocketId(data.userId);
//        var connectionsDico = socketConnections.getConnectionsDico();
//        var connection = connectionsDico[receiverSocketId];
//        connection.chatEnable = data.chatEnable;
//    });


    socket.on('disconnect', function () {
//        socket.broadcast.emit('user:left', {
//            name: user.name
//        });
        users.destroy(user.id);
        userNames.free(user.name);
    });
};