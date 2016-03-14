/**
 * Created by Vitaly Revyuk on 23.02.16.
 */
var db = require('./index');
var log = require('../mylogger');

var User = function () {};

var updateToken = function (id, callback) {
	if(!id) return callback(null, false);
	var token = new Date().getTime();
	var query = db.format('UPDATE dealers_2 SET token = ? WHERE id = ?', [token, id]);
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
	var query = db.format('SELECT * FROM dealers_2 WHERE login = ? AND password = ?', [login, password]);
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
	var query = db.format('SELECT * FROM dealers_2 WHERE token = ?', [token]);
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

	var query = db.format('UPDATE dealers_2 SET password = ? WHERE id = ? AND password = ?', [opt.newPass, opt.dealer, opt.oldPass]);
	db.query(query, function (err, result) {
		return cb(null, result.affectedRows);
	});
};

module.exports.ipStat = function (dealer, cb) {
	if (!dealer) return cb('No option.', 500);
	var query = db.format('SELECT COUNT(*) AS count FROM dealer_networks WHERE dealer = ?', [dealer.id]);
	db.query(query, function (err, result) {
		return cb(err, result[0].count);
	});
};

module.exports.ipStatView = function (dealer, cb) {
	if (!dealer) return cb('No option.', 500);
	var query = db.format('SELECT INET_NTOA(dn.`network`) as network, INET_NTOA(dn.`mask`) as mask, SUM(sp.`pay_sum` / 100) AS sum, COUNT(sp.`regstbid`) as clients ' +
		' FROM `users_stb` as us, `dealer_networks` as  dn, `registred_stb` as rs, `stb_paymets` as sp ' +
		' WHERE dn.`dealer` = ?' +
		' AND rs.`id` = us.`reg_stb_id`' +
		' AND sp.`regstbid` = us.`reg_stb_id`' +
		' AND dn.`network` = us.`curr_stb_ip` & dn.`mask`' +
		' AND sp.`isPseudo` = 0' +
		' AND sp.`is_income` = 1' +
		' AND (true)' +
		' GROUP BY dn.`network`', [dealer.id]);
	db.query(query, function (err, result) {
		return cb(err, result);
	});
};

