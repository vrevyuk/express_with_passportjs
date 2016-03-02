/**
 * Created by glavnyjpolzovatel on 23.02.16.
 */
var db = require('./index');
var log = require('../mylogger');

var User = function () {};

var updateToken = function (id, callback) {
	if(!id) return callback(null, false);
	var token = new Date().getTime();
	var query = db.format('UPDATE dealer SET token = ? WHERE id = ?', [token, id]);
	db.query(query, function (err, result) {

		if(err) return callback(err);

		if (result.changedRows == 1) {
			return callback(null, token);
		} else {
			return callback(null, false);
		}
	});
};


module.exports.findByLoginPassword = function (login, password, callback) {
	var query = db.format('SELECT * FROM dealer WHERE login = ? AND password = ?', [login, password]);
	db.query(query, function (err, result) {
		if(err) {
			return callback(err);
		} else {
			if (result.length == 1) {
				updateToken(result[0].id, function (err, newToken) {
					if (err) {
						return callback(err);
					} else {
						result[0].token = newToken;
						return callback(null, result[0]);
					}
				})
			} else {
				return callback(null, null);
			}
		}
	});
};

module.exports.findByToken = function (token, callback) {
	var query = db.format('SELECT * FROM dealer WHERE token = ?', [token]);
	db.query(query, function (err, result) {
		if(err) {
			return callback(err);
		} else {
			return result.length == 1 ? callback(null, result[0]) : callback(null, null);
		}
	});
};

module.exports.updatePassword = function (opt, cb) {
	if (!opt) return cb('No option.', 500);
	if(opt.newPass != opt.newPass2 || opt.oldPass.length == 0 || opt.newPass.length == 0 || opt.newPass2.length == 0) {
		return cb(null, 0);
	}

	var query = db.format('UPDATE dealer SET password = ? WHERE id = ? AND password = ?', [opt.newPass, opt.dealer, opt.oldPass]);
	db.query(query, function (err, result) {
		return cb(null, result.affectedRows);
	});
};
