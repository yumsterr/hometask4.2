const Messages = require('../services/messages');
const Users = require('../services/user');

module.exports = function (server) {
    let io = require('socket.io')(server);
    io.sockets.on('connection', function (socket) {
        console.log('a user connected');


        socket.on('saveUser', function (data) {
            "use strict";
            Users.add(data, function (err, data) {
                if (!err) {
                    socket.emit('setUserData', data);
                    socket.broadcast.emit('newUser', data);
                }
            });
        });
        socket.on('userTyping', function (userID) {
            socket.broadcast.emit("userTyping", JSON.stringify({userID:userID}));
        });
        socket.on('message', function (data) {
            Messages.add(data, function (err, mess) {
                if (!err) {
                    socket.broadcast.emit("addMessage", JSON.stringify(mess));
                    socket.emit("addMessage", JSON.stringify(mess));
                }
            });

        });

        socket.on('history', function (data) {
            "use strict";
            Messages.getLastCount(100, function (err, messages) {
                let data = {};
                data.mess = messages;
                if (messages.length) {
                    Messages.getUsersInfo(messages, function (err, userInfo) {
                        "use strict";
                        data.users = userInfo;
                        socket.emit('showHistory', data);
                    });
                } else
                    socket.emit('showHistory', data);
            });
        });

        socket.on('getUserInfo', function(userID){
            "use strict";
            let IDs = [];
            IDs.push(userID);
            Users.findOne(IDs, function(err, data){
                console.log(data);
               socket.emit('newUser', data);
            });
        });

        socket.on('disconnect', function () {
            console.log('user disconnected');
        });
    });
};