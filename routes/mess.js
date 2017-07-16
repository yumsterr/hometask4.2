var express = require('express');
var router = express.Router();
const Messages = require('../services/messages');

/* GET users listing. */
router.get('/', function (req, res, next) {
    // console.log(req.body);
    let mess = Messages.find();
    res.send(mess);
});
router.get('/:id', function (req, res, next) {
    let {mess} = Messages.findOne(Number(req.params.id));
    res.send(mess);
});
router.post('/', function (req, res, next) { //http://localhost:1234/api/users/?name=Peter Parker&nickname=Spider-man&email=spideyrullez@gmail.com
    let result = Messages.add(req.query);
    res.send(result);
});
router.put('/:id', function (req, res, next) { //http://localhost:1234/api/users/3/?name=Mighty Hulk
    let update = Messages.update(Number(req.params.id), req.query);
    if(update)
      res.send('saved');
});
router.delete('/:id', function (req, res, next) { //http://localhost:1234/api/users/4/
    let del = Messages.delete(Number(req.params.id));
    if(del)
        res.send('deleted');
});

module.exports = router;
