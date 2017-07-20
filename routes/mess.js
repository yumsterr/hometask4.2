var express = require('express');
var router = express.Router();
const Messages = require('../services/messages');
const Users = require('../services/user');
let onlineUsers = {};


/* GET users listing. */
router.get('/', function (req, res, next) {
    Messages.getMessages(req, function (err, messages) {
        if (!err) {
            let userID = req.query.userID;
            if (userID) {
                onlineUsers[userID] = {
                    'wasActive': Date.now(),
                    'status': 'online'
                };
            }
            onlineUsers = Users.checkUserStatus(onlineUsers);
            let data = {};
            if (messages.length) {
                Messages.getUsersInfo(messages, function (err, userInfo) {
                    "use strict";
                    data.mess = messages;
                    data.user = userInfo;
                    data.online = onlineUsers;
                    res.send(Object.assign({}, data));
                });
            } else {
                data.online = onlineUsers;
                res.send(Object.assign({}, data));
                res.end(JSON.stringify({}));
            }

        } else {
            next(err);
        }
    });

});
router.get('/:id', function (req, res, next) { //http://localhost:1234/api/messages/2/
    let {mess, err} = Messages.findOne(Number(req.params.id));
    if (!err)
        res.send(mess);
    else
        next(err);
});
router.post('/', function (req, res, next) { //http://localhost:1234/api/messages/?senderId=4&receiverId=3&messBody=You're a Friend from Work!
    Messages.add(req.body, function (err) {
        "use strict";
        if (!err) {
            let userID = req.body.userID;
            if (userID) {
                onlineUsers[userID] = {
                    'wasActive': Date.now(),
                    'status': 'online'
                };
            }
            onlineUsers = Users.checkUserStatus(onlineUsers);
            Messages.getSincetime(req.body.date, function (err, messages) {
                if (!err) {
                    let data = {};
                    if (messages.length) {
                        Messages.getUsersInfo(messages, function (err, userInfo) {
                            "use strict";

                            data.mess = messages;
                            data.user = userInfo;
                            data.online = onlineUsers;
                            res.send(Object.assign({}, data));
                        });
                    } else {
                        data.online = onlineUsers;
                        res.send(Object.assign({}, data));
                    }

                } else {
                    next(err);
                }
            });
        }
        else {
            next(err);
        }
    });

});

router.put('/:id', function (req, res, next) { //http://localhost:1234/api/messages/3/?senderId=4
    let {update, err} = Messages.update(Number(req.params.id), req.body);
    if (!err)
        res.send('saved');
    else
        next(err);
});
router.delete('/:id', function (req, res, next) { //http://localhost:1234/api/messages/4/
    let {del, err} = Messages.delete(Number(req.params.id));
    if (!err)
        res.send('deleted');
    else
        next(err);
});

module.exports = router;
