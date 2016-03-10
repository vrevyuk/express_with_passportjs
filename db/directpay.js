/**
 * Created by Vitaly Revyuk on 23.02.16.
 */

var db = require('./index');
var log = require('../mylogger');

var checkCustomer = function (customer, callback) {
	var query = db.format('SELECT * FROM registred_stb WHERE id = ?', [customer]);
	db.query(query, function (err, result) {
		if(err) {
			return callback(err);
		} else {
			return callback(null, result.length);
		}
	});
};

var addDealerMoney = function (opt, callback) {
	var query = db.format('INSERT INTO dealer_money (dealer, sum, time_transaction, customer, description) VALUES(?, ?, unix_timestamp(), ?, ?)',
		[opt.dealer.id, -opt.cost, opt.customer, opt.description]);
	db.query(query, function (err, sqlResult) {
		return callback(null, sqlResult.insertId);
	});
};

var addStbMoney = function (opt, insertId, callback) {
	var paydocnumber = 'DEALER ' + opt.dealer.id + '/' + insertId;
	var query = db.format('INSERT INTO stb_paymets(paydocnum, regstbid, date_pay, time_oper, is_income, pay_sum, desription, isPseudo) ' +
		'VALUES (?, ?, now(), now(), 1, ?, ?, 0)',
		[paydocnumber, opt.customer, opt.cost * 100, 'Payment from dealer ' + opt.dealer.name]);
	db.query(query, function (err, result) {
		if(err) {
			db.query(db.format('DELETE FROM dealer_money WHERE id = ?', [insertId]));
			callback(err);
		} else {
			callback(null, result.insertId > 0 ? 0 : 4);
		}
	});
};

module.exports.get = function (opt, callback) {
	var dealer = 0, start, limit = 15;
	if (opt) {
		dealer = opt.dealer || dealer;
		start = opt.page * limit || 0;
		limit = opt.limit || limit;
	}
	var query = db.format('SELECT COUNT(*) FROM dealer_money WHERE description like \'DIRECT%\' AND dealer = ?',[dealer]);
	db.query(query, function (err, result, fields) {
		if(err) {
			return callback(err);
		} else {
			var count = result[0][fields[0].name];
			var query = db.format('SELECT * FROM dealer_money WHERE description like \'DIRECT%\' AND dealer = ? ORDER BY id DESC LIMIT ?, ?',[dealer, start, limit]);
			db.query(query, function (err, result) {
				if(err) {
					return callback(err);
				} else {
					return callback(null, result, count, limit);
				}
			})
		}
	})
};

module.exports.put = function (opt, callback) {
	if (!opt) return callback(null, 2);

	if(parseInt(opt.sum) <= 0) return callback(null, 2);
	if(parseInt(opt.customer) <= 0) return callback(null, 2);
	db.checkMoney(opt, function (err, balance) {
		if(err) {
			return callback(err);
		} else {
			if(balance < 0) {
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

