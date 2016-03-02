/**
 * Created by glavnyjpolzovatel on 19.02.16.
 */

var conf = require('nconf');
conf.env().file({file: './config/index.json'});
var express = require('express');
var news = express.Router();
var db = require('../db/news');
var log = require('../mylogger');
var dateFormat = require('dateformat');

news.get('/', function (req, res, next) {
    var options = {
        limit: 10
    };
    db.fetch(options, function (err, result) {
        if(err) {
            next(err);
        } else {
            result.forEach(function (item, index, array) {
                item.format_date = dateFormat(new Date(item['create_time'] * 1000), 'dd-mm-yyyy');
            });
            res.render('news', {
                path: 'news',
                isAuth: req.isAuthenticated(),
                user: req.user,
                news: result
            });
        }
    });

});


module.exports = news;
