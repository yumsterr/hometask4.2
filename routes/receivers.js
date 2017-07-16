/**
 * Created by Yumster on 7/16/17.
 */
var express = require('express');
var router = express.Router();
const Messages = require('../services/messages');
const User = require('../services/user');

router.get('/', function (req, res, next) {

    res.send('receivers');
});
router.get('/:id', function (req, res, next) {
    let {resieversIDs} = Messages.findBySender(Number(req.params.id));
    if (resieversIDs.length) {
        let recievers = [];
        for (let i = 0; i < resieversIDs.length; i++) {
            let {user} = User.findOne(resieversIDs[i]);
            recievers.push(user);
        }
        console.log(recievers);
        res.send(recievers);
    } else {
        next('Recievers not found');
    }
});


module.exports = router;
