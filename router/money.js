/**
 * Created by glavnyjpolzovatel on 19.02.16.
 */

var conf = require('nconf');
conf.env().file({file: './config/index.json'});
var express = require('express');
var money = express.Router();
var db = require('../db/money');
var log = require('../mylogger');
var dateformat = require('dateformat');

money.get('/', function (req, res, next) {
    var opt = {
        dealer: req.user,
        page: parseInt(req.query.page) || 0,
        perPage: conf.get('options:rowsPerPage') || 10
    };

    db.moneyList(opt, function (err, result) {
        if(err) {
            next(err);
        } else {
            var prevPage = opt.page - 1;
            if (prevPage < 0) prevPage = 0;
            var nextPage = opt.page + 1;
            if (nextPage >= result.count / opt.perPage) nextPage--;

            result.list.forEach(function (item) {
                item.time_transaction = dateformat(new Date(item.time_transaction) * 1000, 'dd-mm-yyyy');
            });
            res.render('money', {
                path: 'money',
                isAuth: req.isAuthenticated(),
                user: req.user,
                balance: result.balance,
                list: result.list,
                prevPage: prevPage,
                nextPage: nextPage
            })
        }
    });
});

module.exports = money;