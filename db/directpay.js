/**
 * Created by glavnyjpolzovatel on 23.02.16.
 */

var db = require('./index');
var log = require('../mylogger');

var checkCustomer = function (customer, callback) {
	var query = db.format('SELECT * FROM registred_stb WHERE id = ?', [customer]);
	db.query(query, function (err, result) {
		if(err) {
			return callback(new Error(err.message, err.errno));
		} else {
			return callback(null, result.length);
		}
	});
};

var addDealerMoney = function (opt, callback) {
	var query = db.format('INSERT INTO money (dealer_id, sum, type, time_transaction, customer, description) VALUES(?, ?, \'DIRECTPAY\', unix_timestamp(), ?, ?)',
		[opt.user.id, -opt.sum, opt.customer, opt.description]);
	db.query(query, function (err, sqlResult) {
		if(err) {
			return callback(new Error(err.message, err.errno));
		} else {
			return callback(null, sqlResult.insertId);
		}
	});
};

var addStbMoney = function (opt, insertId, callback) {
	var paydocnumber = 'DEALER ' + opt.user.id + '/' + insertId;
	var query = db.format('INSERT INTO stb_paymets(paydocnum, regstbid, date_pay, time_oper, is_income, pay_sum, desription, isPseudo) ' +
		'VALUES (?, ?, now(), now(), 1, ?, ?, 0)',
		[paydocnumber, opt.customer, opt.sum, 'Payment from dealer ' + opt.user.name]);
	db.query(query, function (err, result) {
		if(err) {
			db.query(db.format('DELETE FROM money WHERE id = ?', [insertId]));
			callback(new Error(err.message, err.errno));
		} else {
			callback(null, result.insertId > 0 ? 0 : 4);
		}
	});
};

var checkBalance = function (opt, callback) {
	var query = db.format('SELECT (sum(m.sum) + d.credit - ?) as total_sum FROM `money` AS m, dealer AS d WHERE m.dealer_id = d.id and d.id = ?', [opt.sum, opt.user.id]);
	db.query(query, function (err, result, fields) {
		if(err) {
			return callback(err);
		} else {
			return callback(null, (parseInt(result[0][fields[0].name]) >= 0));
		}
	});
};

var Directpay = function () {};

Directpay.prototype.get = function (opt, callback) {
	var dealer = 0, start, limit = 15;
	if (opt) {
		dealer = opt.dealer || dealer;
		start = opt.page * limit || 0;
		limit = opt.limit || limit;
	}
	var query = db.format('SELECT COUNT(*) FROM money WHERE type = ? AND dealer_id = ?',['DIRECTPAY', dealer]);
	db.query(query, function (err, result, fields) {
		if(err) {
			return callback(new Error(err.message, err.errno));
		} else {
			var count = result[0][fields[0].name];
			var query = db.format('SELECT * FROM money WHERE type = ? AND dealer_id = ? ORDER BY id DESC LIMIT ?, ?',['DIRECTPAY', dealer, start, limit]);
			db.query(query, function (err, result) {
				if(err) {
					return callback(new Error(err.message, err.errno));
				} else {
					return callback(null, result, count, limit);
				}
			})
		}
	})
};

Directpay.prototype.put = function (opt, callback) {
	if (!opt) return callback(null, 2);
	if (!opt.user) return callback(null, 2);
	if(parseInt(opt.sum) <= 0) return callback(null, 2);
	if(parseInt(opt.customer) <= 0) return callback(null, 2);

	checkBalance(opt, function (err, grant) {
		if(err) {
			return callback(err);
		} else {
			if(!grant) {
				return callback(null, 5);
			} else {
				checkCustomer(opt.customer, function (err, found) {
					if(err) {
						return callback(err);
					} else {
						if(found != 1) return callback(null, 3);
						return addDealerMoney(opt, function (err, insertId) {
							if(err) {
								return callback(err);
							} else {
								return addStbMoney(opt, insertId, function (err, resultOfAddStbMoney) {
									callback(err, resultOfAddStbMoney);
								});
							}
						});
					}
				});
			}
		}
	});
};


module.exports = new Directpay();