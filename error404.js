/**
 * Created by vitaly on 16.02.16.
 */

var log = require('./mylogger');

module.exports = function (req, res, next) {
    log('File or path not found. ', req.path);
    res.render('error', {error: 404});
};