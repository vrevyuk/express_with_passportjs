/**
 * Created by vitaly on 16.02.16.
 */
var log = require('mylogger');
var conf = require('nconf');
conf.env().file({file: './config/index.json'});

module.exports = function (err, req, res, next) {
    log.error(err);
    res.status(500);
    if(conf.get('node_env') == 'develop') {
        res.send('Internal error: ', err);
    } else {
        res.send('Internal server error.');
    }
};