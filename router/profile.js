/**
 * Created by glavnyjpolzovatel on 19.02.16.
 */

var express = require('express');
var profile = express.Router();
var db = require('../db/user');
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
            var oldPass = req.body.old_password || '0';
            var newPass = req.body.new_password || '1';
            var newPass2 = req.body.retyped_password || '2';
            var token = req.body.token || -1;

            db.updatePassword(oldPass, newPass, newPass2, token, function (err, affectedtRows) {
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