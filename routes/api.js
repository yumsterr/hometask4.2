/**
 * Created by Yumster on 7/15/17.
 */
var express = require('express');
var router = express.Router();
var users = require('./users');
var mess = require('./mess');
var receivers = require('./receivers');

/* GET users listing. */
router.use('/users', users);
router.use('/messages', mess);
router.use('/receivers', receivers);

module.exports = router;