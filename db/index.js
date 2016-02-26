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
    }
    if(err.errno != 'PROTOCOL_CONNECTION_LOST') {
        log(err.message);
        throw err;
    } else {
        db.end();
        db = mysql.createConnection(connectionOptions);
    }

};

db.on('error', mysqlErrorHandler);
db.connect(function (err) {
    if(!err) {
        /** TODO:
         *  if not exists db must import structure from file into the server !!!
         *  maybe use command line executor for mysql utility ?
         */
    }
});

module.exports = db;