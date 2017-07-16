var express = require('express');
var router = express.Router();
const Messages = require('../services/messages');

/* GET users listing. */
router.get('/', function (req, res, next) {
    // console.log(req.body);
    let mess = Messages.find();
    res.send(mess);
});
router.get('/:id', function (req, res, next) { //http://localhost:1234/api/messages/2/
    let {mess, err} = Messages.findOne(Number(req.params.id));
    if (!err)
        res.send(mess);
    else
        next(err);
});
router.post('/', function (req, res, next) { //http://localhost:1234/api/messages/?senderId=4&receiverId=3&messBody=You're a Friend from Work!
    let {err, newMessage} = Messages.add(req.query);
    if (!err)
        res.send(newMessage);
    else {
        next(err);
    }
});
router.put('/:id', function (req, res, next) { //http://localhost:1234/api/messages/3/?senderId=4
    let {update, err} = Messages.update(Number(req.params.id), req.query);
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
