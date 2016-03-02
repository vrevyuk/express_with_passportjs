/**
 * Created by glavnyjpolzovatel on 23.02.16.
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
	var query = db.format('SELECT groups as name, count(*) as unused, sum(sum) as sum FROM dealer_codes WHERE promo = 1 AND dealer = ? AND status = 0 GROUP BY groups;\n ' +
		'SELECT groups as name, count(*) as used FROM dealer_codes WHERE promo = 1 AND dealer = ? AND status != 0 GROUP BY groups;\n' +
		'SELECT * FROM dealer_tariffs', [opt.dealer, opt.dealer]);
	//log(query);
	db.query(query, function (err, result) {
		if (err) {
			return cb(err);
		} else {
			var max = Math.max(result[0].length, result[1].length);
			var out = [];
			for(var i = 0; i < max; i++) {
				if (!result[0][i]) result[0][i] = {};
				if (!result[1][i]) result[1][i] = {};
				out.push({
					name: result[0][i].name || result[1][i].name,
					unused: result[0][i].unused || 0,
					used: result[1][i].used || 0,
					sum: result[0][i].sum || result[1][i].sum
				});
			}
			return cb(err, out, result[2]);
		}
	});
};

module.exports.add = function (opt, cb) {
	if (!opt) return cb(new Error('No option.', 500));
	if (parseInt(opt.cost) <= 0 || parseInt(opt.count) <= 0) return cb(null, 'error=Wrong parameters.');

	checkLimit(opt, function (err, resultofCheckLimit) {
		if (err) {
			return cb(err);
		} else {
			if (resultofCheckLimit < 0) {
				return cb(null, 'error=Превышен лимит.');
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
									return cb(null, 'success=Успешно.');
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
