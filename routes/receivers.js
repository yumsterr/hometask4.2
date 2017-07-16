/**
 * Created by Yumster on 7/16/17.
 */
var express = require('express');
var router = express.Router();
const Messages = require('../services/messages');
const User = require('../services/user');

router.get('/:id', function (req, res, next) { //
    let {resieversIDs, err} = Messages.findBySender(Number(req.params.id));
    if (!err) {
        let recievers = [];
        for (let i = 0; i < resieversIDs.length; i++) {
            let {user} = User.findOne(resieversIDs[i]);
            recievers.push(user);
        }
        res.send(recievers);
    } else {
        next(err);
    }
});


module.exports = router;
