/**
 * Created by Vitaly Revyuk on 19.02.16.
 */

var express = require('express');
var profile = express.Router();
var db = require('../db/user');
var log = require('../mylogger');

profile.get('/', function (req, res, next) {
    return res.render('ipstat', {
        path: 'profile',
        isAuth: req.isAuthenticated(),
        user: req.user,
        ipstat: []
    })
});

profile.post('/', function (req, res, next) {
    var opt = {
        dealer: req.user,
        fromDate: req.body.fromDate,
        toDate: req.body.toDate
    };
    db.ipStatView(opt, function (err, result) {
        if (err) {
            return next(err);
        } else {
            return res.render('ipstat', {
                path: 'profile',
                isAuth: req.isAuthenticated(),
                user: req.user,
                ipstat: result,
                fromDate: req.body.fromDate,
                toDate: req.body.toDate
            })
        }
    });
});


module.exports = profile;