/**
 * Created by vitaly on 16.02.16.
 */
var log = require('./mylogger');
var conf = require('nconf');
conf.env().file({file: './config/index.json'});

module.exports = function (err, req, res, next) {
    log(err);
    res.render('error', {error: 500});
};