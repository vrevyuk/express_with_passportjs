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
		if(err) return callback(new Error(err.message, err.errno));
		if (result.changedRows == 1) {
			return callback(null, token);
		} else {
			return callback(null, false);
		}
	});
};


User.prototype.findByLoginPassword = function (login, password, callback) {
	var query = db.format('SELECT * FROM dealer WHERE login = ? AND password = ?', [login, password]);
	db.query(query, function (err, result) {
		if(err) {
			return callback(new Error('' + err, err.errno));
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

module.exports = new User();