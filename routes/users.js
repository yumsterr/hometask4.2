var express = require('express');
var router = express.Router();
const Users = require('../services/user');

/* GET users listing. */
router.get('/', function (req, res, next) {
    let users = Users.find();
    res.send(users);
});
router.get('/:id', function (req, res, next) { //http://localhost:1234/api/users/2/
    let {user, err} = Users.findOne(Number(req.params.id));
    if (!err)
        res.send(user);
    else
        next(err);
});
router.post('/', function (req, res, next) { //http://localhost:1234/api/users/?name=Peter Parker&nickname=Spider-man&email=spideyrullez@gmail.com
    let {err, newUser} = Users.add(req.query);
    if (!err)
        res.send(newUser);
    else {
        next(err);
    }
});
router.put('/:id', function (req, res, next) { //http://localhost:1234/api/users/3/?nickname=Mighty Hulk
    let {user, err} = Users.update(Number(req.params.id), req.query);
    if (!err)
        res.send(user);
    else
        next(err);
});
router.delete('/:id', function (req, res, next) { //http://localhost:1234/api/users/4/
    let {err} = Users.delete(Number(req.params.id));
    if (!err)
        res.send('User deleted');
    else
        next(err);
});

module.exports = router;
