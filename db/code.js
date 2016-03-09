/**
 * Created by Vitaly Revyuk on 23.02.16.
 */
var db = require('./index');
var log = require('../mylogger');

module.exports.viewGroup = function (opt, cb) {
	if (!opt) return cb(new Error('No option.', 500));
	var perPage = opt.perPage || 10;
	var start = perPage * opt.page;
	var query = db.format('SELECT * FROM dealer_codes WHERE promo = 0 AND dealer = ? AND groups = ? LIMIT ?, ?;\n' +
		'SELECT count(*) as count, groups as name FROM dealer_codes WHERE promo = 0 AND dealer = ? AND groups = ?', [opt.dealer, opt.group, start, perPage, opt.dealer, opt.group]);
	db.query(query, function (err, result) {
		if (err) {
			cb(err);
		} else {
			cb(null, result);
		}
	});
};

module.exports.getGroups = function (opt, cb) {
	if (!opt) return cb(new Error('No option.', 500));
	var query = db.format('SELECT groups as name, sum(sum) as sum, sum(status=0) as unused, sum(status=1) as used FROM dealer_codes WHERE dealer = ? AND promo = 0 GROUP BY groups', [opt.dealer]);
	db.query(query, function (err, result) {
		if (err) {
			return cb(err);
		} else {
			return cb(err, result);
		}
	});
};

module.exports.add = function (opt, cb) {
	if (!opt) return cb(new Error('No option.', 500));
	if (parseInt(opt.cost) <= 0 || parseInt(opt.count) <= 0) return cb(null, 'error=' + encodeURIComponent('Ошибка при вводе данных.'));
	db.checkMoney(opt, function (err, resultofCheckMoney) {
		if (err) {
			return cb(err);
		} else {
			if (resultofCheckMoney < 0) {
				return cb(null, 'error=' + encodeURIComponent('Превышен лимит.'));
			} else {
				return db.beginTransaction(function (err) {
					if (err) return cb(err);
					db.makeCode(0, opt, function (err) {
						if (err) {
							db.rollback(function () {
								cb(err)
							});
						} else {
							db.commit(function (err) {
								if (err) {
									return cb(err);
								} else {
									return cb(null, 'success=' + encodeURIComponent('Успешно.'));
								}
							});
						}
					});
				});
			}
		}
	});

};

module.exports.removeGroup = function (opt, cb) {
	if (!opt) return cb(new Error('No option.', 500));
	var query = db.format('DELETE FROM dealer_codes WHERE dealer = ? AND groups = ? AND status = 0 AND promo = 0', [opt.dealer, opt.group]);
	db.query(query, function (err, result) {
		cb(err, result ? result.affectedRows : 0);
	});
};

module.exports.removeCode = function (opt, cb) {
	if (!opt) return cb(new Error('No option.', 500));
	var query = db.format('DELETE FROM dealer_codes WHERE dealer = ? AND groups = ? AND id = ? AND status = 0 AND promo = 0', [opt.dealer, opt.group, opt.code]);
	db.query(query, function (err, result) {
		cb(err, result ? result.affectedRows : 0);
	});
};

module.exports.getFile = function (opt, cb) {
	if (!opt) return cb(new Error('No option.', 500));
	var query = db.format('SELECT * FROM dealer_codes WHERE dealer = ? AND groups = ? AND status = 0 AND promo = 0', [opt.dealer, opt.group]);
	db.query(query, function (err, result) {
		return cb(err, result);
	});
};
