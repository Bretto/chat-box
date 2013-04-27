// Keep track of which names are used so that there are no duplicates
var userNames = (function () {
    var names = {};

    var claim = function (name) {
        if (!name || names[name]) {
            return false;
        } else {
            names[name] = {name:name, online:true};
            return true;
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

    // serialize claimed names as an array
    var get = function (name) {
        var res = [];
        for (n in names) {
            //if(n !== name){
                user = names[n];
                res.push(user);
            //}
        }

        return res;
    };

    var offline = function (name) {
        if (names[name]) {
            names[name].online = false;
        }
    };

    var status = function (name, status) {
        if (names[name]) {
            names[name].online = status;
        }
    };

    var free = function (name) {
        if (names[name]) {
            delete names[name];
        }
    };

    return {
        claim: claim,
        free: free,
        status: status,
        get: get,
        getGuestName: getGuestName
    };
}());


// export function for listening to the socket
module.exports = function (socket) {
    var name = userNames.getGuestName();

    // send the new user their name and a list of users
    socket.emit('init', {
        user: {name: name, online:true},
        users: userNames.get(name)
    });

    // notify other clients that a new user has joined
    socket.broadcast.emit('user:join', {
        name: name
    });

    socket.on('change:status', function (data, fn) {

        socket.broadcast.emit('change:status', {
            name: name,
            status: data.status
        });
        userNames.status(name, data.status);

        fn(true);
    });


    // broadcast a user's message to other users
    socket.on('send:message', function (data) {
        socket.broadcast.emit('send:message', {
            user: name,
            text: data.message
        });
    });

    socket.on('send:noty', function (data) {
        socket.broadcast.emit('send:noty', data);
    });


    // validate a user's name change, and broadcast it on success
    socket.on('change:name', function (data, fn) {
        if (userNames.claim(data.name)) {
            var oldName = name; // where are they getting name from ?
            userNames.free(oldName);

            name = data.name;

            socket.broadcast.emit('change:name', {
                oldName: oldName,
                newName: name
            });

            fn(true);
        } else {
            fn(false);
        }
    });


    // clean up when a user leaves, and broadcast it to other users
    socket.on('disconnect', function () {
        socket.broadcast.emit('user:disconnect', {
            name: name
        });
        userNames.free(name);
    });
};