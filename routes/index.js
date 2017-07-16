var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    let err = new Error('Forbidden');
    err.status = 403;
    next(err);
});

module.exports = router;
