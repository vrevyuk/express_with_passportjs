/**
 * Created by vitaly on 16.02.16.
 */
var express = require('express');
var router = express.Router();
var log = require('../mylogger');

router.get('/', function (req, res) {
    return res.redirect('/news');
    //res.render('greeting', {
    //    path: req.path,
    //    isAuth: req.isAuthenticated(),
    //    user: req.user
    //});
});

router.get('/logout', function (req, res) {
    req.logout();
    req.session.destroy();
    res.redirect('/login');
});

router.get('/greeting', function (req, res) {
    res.render('greeting', {
        path: req.path,
        isAuth: req.isAuthenticated(),
        user: req.user
    });
});

module.exports = router;