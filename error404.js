/**
 * Created by vitaly on 16.02.16.
 */

var log = require('mylogger');

module.exports = function (req, res, next) {
    log.warn('File or path not found. ', req.path);
    res.status(404);
    res.send('Not found.');
};