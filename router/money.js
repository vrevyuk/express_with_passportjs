/**
 * Created by glavnyjpolzovatel on 19.02.16.
 */

var conf = require('nconf');
conf.env().file({file: './config/index.json'});
var express = require('express');
var profile = express.Router();
var db = require('../db');
var log = require('../mylogger');

profile.get('/', function (req, res, next) {
    res.redirect('/money/0');
});

profile.get('/:page', function (req, res, next) {
    var count = conf.get('options:rowsPerPage') || 10;
    var start = req.params.page * count;

    db.money.find(req.user.token, start, count, function (err, balance, allcount, result) {
        if(err) {
            next(new Error(err, err.errno));
        } else {

            var prevPage = parseInt(req.params.page) - 1;
            if(prevPage < 0) prevPage = 0;

            var nextPage = parseInt(req.params.page) + 1;
            if(nextPage > allcount / count) nextPage = Math.floor(allcount / count);

            res.render('money', {
                path: 'money',
                isAuth: req.isAuthenticated(),
                user: req.user,
                balance: balance,
                list: result,
                prevPage: prevPage,
                nextPage: nextPage
            })
        }
    });
});

module.exports = profile;