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
            var opt = {
                oldPass: req.body.old_password,
                newPass: req.body.new_password,
                newPass2: req.body.retyped_password,
                dealer: req.user.id
            };

            db.updatePassword(opt, function (err, affectedtRows) {
                if(err) {
                    next(err);
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