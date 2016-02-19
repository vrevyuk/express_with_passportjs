/**
 * Created by vitaly on 16.02.16.
 */
var mysql = require('mysql');
var conf = require('nconf');
var log = require('../mylogger');
conf.env().file({file: './config/index.json'});

var connectionOptions = {
    socketPath: conf.get('database:socket'),
    host: conf.get('database:host'),
    user: conf.get('database:user'),
    password: conf.get('database:password'),
    database: conf.get('database:name')
};

var db = mysql.createConnection(connectionOptions);

var mysqlErrorHandler = function (err) {
    if(!err.fatal) {
        return;
        //log.warn(err);
    }
    if(err.errno != 'PROTOCOL_CONNECTION_LOST') {
        //log.warn(err);
        //throw err;
    } else {
        db.end();
        db = mysql.createConnection(connectionOptions);
    }

};

db.on('error', mysqlErrorHandler);
db.connect();

var User = function () {};
var Money = function () {};

/**
 *          User access model
 * */
User.prototype.findByLoginPassword = function (login, password, callback) {
    var query = db.format('SELECT * FROM dealer WHERE login = ? AND password = ?', [login, password]);
    db.query(query, function (err, result) {
        if(err) {
            return callback(new Error('' + err, err.errno));
        } else {
            return result.length == 1 ? callback(null, result[0]) : callback(null, null);
        }
    });
};

User.prototype.findByToken = function (token, callback) {
    var query = db.format('SELECT * FROM dealer WHERE token = ?', [token]);
    db.query(query, function (err, result) {
        if(err) {
            return callback(new Error('' + err, err.errno));
        } else {
            return result.length == 1 ? callback(null, result[0]) : callback(null, null);
        }
    });
};

User.prototype.updatePassword = function (oldPass, newPass, newPass2, token, callback) {
    var oldPassHash = oldPass;
    var newPassHash = newPass;

    log.info(oldPass, newPass, newPass2, token);
    if(newPass != newPass2 || oldPass.length == 0 || newPass.length == 0 || newPass2.length == 0) {
        return callback(null, 0);
    }

    var query = db.format('UPDATE dealer SET password = ? WHERE token = ? AND password = ?', [newPassHash, token, oldPassHash]);
    db.query(query, function (err, result) {
        if(err) {
            return callback(err);
        } else {
            return callback(null, result.affectedRows);
        }
    });
};

/**
 *              Money view model
 **/

Money.prototype.find = function (token, start, count, callback) {
    if(!token) return callback(null, 0, 0);
    if (!start) start = 0;
    if (!count) count = 20;
    var query = db.format('SELECT m.* FROM dealer AS d, money AS m WHERE m.dealer_id = d.id AND d.token = ? ORDER BY m.id DESC LIMIT ?, ?',[token, start, count]);
    db.query(query, function (err, result) {
        if(err) {
            return callback(new Error(err, err.errno));
        } else {
            if(result.length == 0) {
                return callback(null, 0, 0);
            } else {
                query = query.replace('m.*', 'COUNT(*), sum(m.sum)').replace('LIMIT ' + start + ', ' + count, '');
                db.query(query, function (err, limitResult, fields) {
                    if(err) {
                        return callback(new Error(err, err.errno));
                    } else {
                        return callback(null, limitResult[0][fields[1].name], limitResult[0][fields[0].name], result);
                    }
                });
            }
        }
    })
};


module.exports.user = new User();
module.exports.money = new Money();