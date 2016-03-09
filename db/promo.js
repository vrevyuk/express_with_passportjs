/**
 * Created by Vitaly Revyuk on 23.02.16.
 */
var db = require('./index');
var log = require('../mylogger');

var checkLimit = function (opt, cb) {
	if (!opt) return cb(new Error('No option.', 500));
	var query = db.format('SELECT sum(sum) as sum FROM dealer_codes WHERE dealer = ? AND promo = 1 AND status = 0', [opt.dealer.id]);
	db.query(query, function (err, result) {
		if (err) {
			return cb(err);
		} else {
			var sum = parseInt(opt.dealer.promo_sum);
			sum -= parseInt(opt.count) * parseInt(opt.cost);
			sum -= parseInt(result[0].sum || 0);
			return cb(null, sum);
		}
	});
};


module.exports.getPromoListGroups = function (opt, cb) {
	if (!opt) return cb(new Error('No option.', 500));
	var query = db.format('SELECT groups as name, sum(sum) as sum, sum(status=0) as unused, sum(status=1) as used FROM dealer_codes WHERE dealer = ? AND promo = 1 GROUP BY groups;\n' +
		'SELECT t.*, dt.duration, t.current_price / 100 * 30 * dt.duration as cost FROM tarifs as t, dealer_tariffs as dt WHERE t.id = dt.tariff AND dt.dealer = ?;\n', [opt.dealer, opt.dealer]);
	db.query(query, function (err, result) {
		if (err) {
			return cb(err);
		} else {
			return cb(err, result[0], result[1]);
		}
	});
};

module.exports.add = function (opt, cb) {
	if (!opt) return cb(new Error('No option.', 500));
	if (!opt.cost || !opt.count) return cb(null, 'error=' + encodeURIComponent('Ошибка при вводе данных.'));

	checkLimit(opt, function (err, resultofCheckLimit) {
		if (err) {
			return cb(err);
		} else {
			if (resultofCheckLimit < 0) {
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

module.exports.viewGroup = function (opt, cb) {
	if (!opt) return cb(new Error('No option.', 500));
	var perPage = opt.perPage || 10;
	var start = perPage * opt.page;
	var query = db.format('SELECT * FROM dealer_codes WHERE promo = 1 AND dealer = ? AND groups = ? LIMIT ?, ?;\n' +
		'SELECT count(*) as count, groups as name FROM dealer_codes WHERE promo = 1 AND dealer = ? AND groups = ?', [opt.dealer, opt.group, start, perPage, opt.dealer, opt.group]);
	db.query(query, function (err, result) {
		if (err) {
			cb(err);
		} else {
			cb(null, result);
		}
	});
};

module.exports.removeGroup = function (opt, cb) {
	if (!opt) return cb(new Error('No option.', 500));
	var query = db.format('DELETE FROM dealer_codes WHERE dealer = ? AND groups = ? AND status = 0 AND promo = 1', [opt.dealer, opt.group]);
	db.query(query, function (err, result) {
		cb(err, result ? result.affectedRows : 0);
	});
};

module.exports.removeCode = function (opt, cb) {
	if (!opt) return cb(new Error('No option.', 500));
	var query = db.format('DELETE FROM dealer_codes WHERE dealer = ? AND groups = ? AND id = ? AND status = 0 AND promo = 1', [opt.dealer, opt.group, opt.code]);
	db.query(query, function (err, result) {
		cb(err, result ? result.affectedRows : 0);
	});
};

module.exports.getFile = function (opt, cb) {
	if (!opt) return cb(new Error('No option.', 500));
	var query = db.format('SELECT * FROM dealer_codes WHERE dealer = ? AND groups = ? AND status = 0 AND promo = 1', [opt.dealer, opt.group]);
	db.query(query, function (err, result) {
		return cb(err, result);
	});
};

