/**
 * Created by glavnyjpolzovatel on 19.02.16.
 */

var conf = require('nconf');
conf.env().file({file: './config/index.json'});
var express = require('express');
var dpay = express.Router();
var db = require('../db/directpay');

var log = require('../mylogger');
var dateFormat = require('dateFormat');

dpay.post('/', function (req, res, next) {
    if (!req.body.sum || !req.body.account) return res.redirect('/directpay?result=1');
    var options = {
        user: req.user,
        sum: req.body.sum,
        customer: req.body.account,
        description: req.body.description
    };
    db.put(options, function (err, result) {
        if(err) {
            next(err)
        } else {
            res.redirect('/directpay?result=' + result);
        }
    });
});

dpay.get('/', function (req, res, next) {
    var opt = {
        page: req.query.page || 0,
        dealer: req.user.id
    };
    db.get(opt, function (err, result, count, limit) {
        if(err) {
            return next(err);
        } else {
            result.forEach(function (item) {
                item.formated_date = dateFormat(item.time_transaction * 1000, 'dd-mm-yyyy');
            });
            var prevPage = parseInt(opt.page) - 1;
            var nextPage = parseInt(opt.page) + 1;

            if (prevPage < 0) prevPage = 0;
            if (count <= (nextPage * limit)) nextPage--;

            return res.render('directpay', {
                path: 'directpay',
                isAuth: req.isAuthenticated(),
                user: req.user,
                money: result,
                postError: req.query.result,
                prevPage: prevPage,
                nextPage: nextPage
            });
        }
    });
});


module.exports = dpay;
