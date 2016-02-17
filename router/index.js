/**
 * Created by vitaly on 16.02.16.
 */
var express = require('express');
var router = express.Router();
var log = require('mylogger');

router.use('/logout', function (req, res, next) {
    if(req.isAuthenticated()) {
        req.logout();
        req.session.destroy(function (err) {
            if (err) log.error(JSON.stringify(err));
        });
        res.redirect('/');
    } else {
        next();
    }
});

router.use('/', function (req, res, next) {
    log.info('/');
    if (req.isAuthenticated()) {
        res.render('main', {user: req.user});
    } else {
        res.render('greeting');
    }
});

module.exports = router;