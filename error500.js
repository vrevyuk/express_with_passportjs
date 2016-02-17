/**
 * Created by vitaly on 16.02.16.
 */
var log = require('mylogger');
var conf = require('nconf');
conf.env().file({file: './config/index.json'});

module.exports = function (err, req, res, next) {
    log.error('ER:' + err);
    res.status(err);
    switch (parseInt(err)) {
        case 401:
            res.send('(' + err + ') Require authorization.');
            break;
        default:
            res.send('(' + err + ') Internal  server error.');
    }
};