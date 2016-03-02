/**
 * Created by vitaly on 16.02.16.
 */
var mysql = require('mysql');
var conf = require('nconf');
var log = require('../mylogger');
conf.env().file({file: './config/index.json'});
var Cryptojs = require('crypto-js');

var connectionOptions = {
    socketPath: conf.get('database:socket'),
    host: conf.get('database:host'),
    user: conf.get('database:user'),
    password: conf.get('database:password'),
    database: conf.get('database:name'),
    multipleStatements: true
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

/**
 *
 * @param opt
 *  {
 *      dealer: req.user,
 *      stok: int 1 || 0,
 *      cost: int > 0 || undefined
 *      count: int > 0 || undefined
 *  }
 * @param cb
 *  function cb(error, int sum)
 */
module.exports.checkMoney = function (opt, cb) {
    if (!opt) cb(null, false);
    var moneySumQuery = db.format('SELECT sum(sum) as sum FROM money WHERE dealer = ?;\n', [opt.dealer.id]);
    var codeSumQuery = db.format('SELECT sum(sum) as sum FROM codes WHERE promo = 0 AND status = 0 AND dealer = ?;\n', [opt.dealer.id]);
    db.query(moneySumQuery + codeSumQuery, function (err, results) {
        if(err) {
            return cb(err);
        } else {
            var requestSum = (opt.cost || 0) * (opt.count || 0);
            var moneySum = (results[0][0].sum ? parseInt(results[0][0].sum) : 0) + (parseInt(opt.dealer.credit) || 0);
            var codeSum = results[1][0].sum ? parseInt(results[1][0].sum) : 0;
            return cb(null, moneySum - codeSum - requestSum);
        }
    });
};

module.exports.makeCode = function (start, opt, cb) {
    var promo = opt.promo || 0;
    var description = opt.description || '';
    var data = new Date().getTime() + Math.random() * 100;
    var hashCode = Cryptojs.SHA1(data.toString()).toString().replace(/[A-Za-z]/g, '').substr(0, 16);
    var query = db.format('INSERT INTO codes (code, expire, dealer, sum, promo, groups, status, customer, description) ' +
        ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [hashCode, opt.expire, opt.dealer.id, opt.cost, promo, opt.name, 0, 0, description]);
    var self = db;
    db.query(query, function (err, result) {
        if (err || result.affectedRows == 0) {
            if (err.code != 'ER_DUP_ENTRY') {
                return cb(err || new Error('Not inserted rows', 500));
            } else {
                return self.makeCode(start, opt, cb);
            }
        } else {
            if(start >= opt.count - 1) {
                return cb();
            } else {
                return self.makeCode(++start, opt, cb);
            }
        }
    });
};

