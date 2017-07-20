const Messages = require('../services/messages');
const Users = require('../services/user');
let onlineUsers = {};

module.exports = function (server) {
    let io = require('socket.io')(server);
    io.sockets.on('connection', function (socket) {
        console.log('a user connected');
        if (socket.handshake.query.userID) {
            let userID = socket.handshake.query.userID;
            if (userID) {
                Users.findOne(userID, function (err, data) {
                    let userData = {
                        loginTime: Date.now(),
                        status: 'new',
                        name: data[userID].name,
                        nickname: data[userID].nickname,
                        _id: userID
                    };
                    onlineUsers[userID] = userData;
                    socket.emit("setUsersOnline", JSON.stringify(onlineUsers));
                    socket.broadcast.emit("setUsersOnline", JSON.stringify(onlineUsers));

                });
            }
        }

        socket.on('saveUser', function (data) {
            "use strict";
            Users.add(data, function (err, data) {
                if (!err) {
                    socket.emit('setUserData', data);
                    data = JSON.parse(data);
                    let userData = {
                        loginTime: Date.now(),
                        status: 'new',
                        name: data.name,
                        nickname: data.nickname,
                        _id: data._id
                    };
                    onlineUsers[data._id] = userData;
                    socket.emit("setUsersOnline", JSON.stringify(onlineUsers));
                    socket.broadcast.emit("setUsersOnline", JSON.stringify(onlineUsers));
                }
            });
        });

        socket.on('userTyping', function (userID) {
            socket.broadcast.emit("userTyping", JSON.stringify({userID: userID}));
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

        socket.on('getUserInfo', function (userID) {
            "use strict";
            Users.findOne(userID, function (err, data) {
                // socket.emit('newUser', JSON.stringify(data));

                socket.emit('setUsersOnline', JSON.stringify(onlineUsers));
            });
        });
        socket.on('userLeftUs', function (userID) {
            "use strict";
            let userName = onlineUsers[userID].nickname;
            delete onlineUsers[userID];
            socket.broadcast.emit("setUsersOnline", JSON.stringify(onlineUsers));
            socket.broadcast.emit("tellAboutLeaving", JSON.stringify({userName:userName}));
        });
        socket.on('getUsersOnline', function () {
            "use strict";
            socket.emit('setUsersOnline', JSON.stringify(onlineUsers));

        });

        socket.on('disconnect', function () {
            console.log('user disconnected');
        });


    });
};

