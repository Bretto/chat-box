


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

    var user;
    var usersDico;

    var init = function(){
        user = userNames.getUser();
        user.sId = socket.id;
        user.rooms = {};
        user.chatable = false;
        usersDico = users.getUsersDico();
        usersDico[user.id] = user;

        socket.emit('user:connect', user);
    }

    socket.on('user:join', function(data, fn){
        socket.join(data.roomId);
        user.rooms[data.roomId] = data.roomId;


        var joinData = {user:user, roomId:data.roomId};
        socket.broadcast.to(data.roomId).emit('user:join', joinData);

        var chatable = false;
        if(usersDico[data.tUser.id] && usersDico[data.tUser.id].chatable){
            chatable = true;
            var sId = usersDico[data.tUser.id].sId;
            // ask user to join room
            if(global.io.sockets.clients(data.roomId).length === 1){
                global.io.sockets.socket(sId).emit('msgAlert', data);
            }else{
                socket.broadcast.to(data.roomId).emit('user:chatable', {chatable:chatable, roomId:data.roomId});
            }
        }

        fn({chatable:chatable});
    });

    socket.on('user:leave', function(roomId){
        socket.leave(roomId);
        delete user.rooms[roomId];
        var leaveData = {user:user, roomId:roomId}
        socket.broadcast.to(roomId).emit('user:leave', leaveData);
    });

    socket.on('user:msg', function (data) {

        //Safeguard
        if(!usersDico[data.tUser.id])return;

        var tUser = usersDico[data.tUser.id];
        var sId = tUser.sId;

        var dateTime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        data.dateTime = dateTime;
        data.tUser = user;


        //TODO save msg to mySQL

        if(tUser.chatable){
            //if client and vendor are in the room send msg
            if(global.io.sockets.clients(data.roomId).length === 2){
                socket.broadcast.to(data.roomId).emit('user:msg', data);
            }
            //else send a msgAlert to vendor or client...
            else{
                global.io.sockets.socket(sId).emit('msgAlert', data);
            }
        }
    });

    socket.on('user:chatable', function (chatable) {
        user.chatable = chatable;

        for(room in user.rooms){
            socket.broadcast.to(room).emit('user:chatable', {chatable:chatable, roomId:room});
        }
    });


    socket.on('disconnect', function () {

        if(!user)return;

        for(room in user.rooms){
            socket.broadcast.to(room).emit('user:leave', {name:user.name, roomId:room});
        }

        users.destroy(user.id);
        userNames.free(user.name);

    });

    init();
};