var express = require('express');
var router = express.Router();
const Users = require('../services/user');

/* GET users listing. */
router.get('/', function (req, res, next) {
    // console.log(req.body);
    let users = Users.find();
    res.send(users);
});
router.get('/:id', function (req, res, next) {
    let {user} = Users.findOne(Number(req.params.id));
    res.send(user);
});
router.post('/', function (req, res, next) { //http://localhost:1234/api/users/?name=Peter Parker&nickname=Spider-man&email=spideyrullez@gmail.com
    let result = Users.add(req.query);
    res.send(result);
});
router.put('/:id', function (req, res, next) { //http://localhost:1234/api/users/3/?name=Mighty Hulk
    Users.update(Number(req.params.id), req.query);
    res.send('users');
});
router.delete('/:id', function (req, res, next) { //http://localhost:1234/api/users/4/
    Users.delete(Number(req.params.id));
    res.send('users');
});

module.exports = router;
