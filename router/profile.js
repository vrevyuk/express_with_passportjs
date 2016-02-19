/**
 * Created by glavnyjpolzovatel on 19.02.16.
 */

var express = require('express');
var profile = express.Router();
var db = require('../db');
var log = require('../mylogger');

profile.get('/', function (req, res) {
    res.render('profile', {
        path: 'profile',
        isAuth: req.isAuthenticated(),
        user: req.user
    })
});

profile.post('/', function (req, res, next) {
    switch (req.body.action) {
        case 'changepasswd':
            var oldPass = req.body.old_password || '';
            var newPass = req.body.new_password || '';
            var newPass2 = req.body.retyped_password || '';
            var token = req.body.token || -1;

            db.user.updatePassword(oldPass, newPass, newPass2, token, function (err, affectedtRows) {
                if(err) {
                    next(new Error(err, err.errno));
                } else {
                    res.render('profile', {
                        path: 'profile',
                        isAuth: req.isAuthenticated(),
                        user: req.user,
                        updatedPassword: affectedtRows
                    });
                }
            });
            break;
    }
});

module.exports = profile;