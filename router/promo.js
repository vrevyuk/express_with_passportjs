/**
 * Created by glavnyjpolzovatel on 19.02.16.
 */

var conf = require('nconf');
conf.env().file({file: './config/index.json'});
var express = require('express');
var promo = express.Router();
var db = require('../db/promo');
var log = require('../mylogger');
var dateformat = require('dateformat');

promo.post('/', function (req, res, next) {
    var expire = Date.parse(req.body.expire) / 1000;
    if(req.body.series_name.length == 0 || !expire || parseInt(req.body.count) < 1 || parseInt(req.body.count) > 10000000000) {
        return res.redirect('/promo?error=Ошибка в веденных данных.');
    }
    var opt = {
        name: req.body.series_name,
        cost: req.body.cost,
        expire: expire,
        promo: 1,
        count: req.body.count,
        description: req.body.description,
        dealer: req.user
    };

    db.add(opt, function (err, result) {
        if(err) return next(err);
        return res.redirect('/promo?' + result);
    });
});

promo.get('/', function (req, res, next) {
    var opt = {
        dealer: req.user.id
    };
    db.getPromoListGroups(opt, function (err, result ,tariffs) {
        if (err) {
            next(err);
        } else {
            res.render('promo', {
                path: 'promo',
                isAuth: req.isAuthenticated(),
                user: req.user,
                error: req.query.error,
                success: req.query.success,
                groups: result,
                tariffs: tariffs
            });
        }
    });
});

promo.get('/:name', function (req, res, next) {
    var opt = {
        group: req.params.name,
        dealer: req.user.id,
        page: parseInt(req.query.page) || 0,
        perPage: conf.get('options:rowsPerPage') || 10
    };
    db.viewGroup(opt, function (err, result) {
        if(err) {
            return next(err);
        } else {
            var prevPage = opt.page - 1;
            if (prevPage < 0) prevPage = 0;
            var nextPage = opt.page + 1;
            if (nextPage >= result[1][0].count / opt.perPage) nextPage--;

            result[0].forEach(function (item) {
                item.expire = dateformat(new Date(item.expire) * 1000, 'dd-mm-yyyy');
            });

            return res.render('group_promo', {
                path: 'promo',
                isAuth: req.isAuthenticated(),
                user: req.user,
                error: req.query.error,
                success: req.query.success,
                count: result[1][0].count,
                groupname: result[1][0].name,
                list: result[0],
                prevPage: prevPage,
                nextPage: nextPage,
                page: opt.page
            });
        }
    });
});

module.exports = promo;