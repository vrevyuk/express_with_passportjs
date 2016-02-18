/**
 * Created by vitaly on 16.02.16.
 */
var mysql = require('mysql');
var conf = require('nconf');
var log = require('mylogger');
conf.env().file({file: './config/index.json'});

var dbuser = {
    username: 'vitaly',
    password: 'retroi2002',
    token: 1234567890
};

var User = function () {
}

User.prototype.findByLoginPassword = function (login, password, callback) {
    log.info('DB received: ', login, password);
    if (login == dbuser.username && password == dbuser.password) {
        return callback(null, dbuser);
    } else {
        return callback(401, null);
    }
}

User.prototype.findByToken = function (token, callback) {
    if (token == dbuser.token) {
        return callback(null, dbuser);
    } else {
        return callback(401, null);
    }
}

module.exports.User = new User();