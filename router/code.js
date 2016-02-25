/**
 * Created by glavnyjpolzovatel on 19.02.16.
 */

var conf = require('nconf');
conf.env().file({file: './config/index.json'});
var express = require('express');
var code = express.Router();
var db = require('../db');
var log = require('../mylogger');

code.get('/', function (req, res, next) {
    res.render('code', {
        path: 'code',
        isAuth: req.isAuthenticated(),
        user: req.user
    });
});


module.exports = code;
