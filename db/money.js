/**
 * Created by glavnyjpolzovatel on 23.02.16.
 */
var db = require('./index');
var log = require('../mylogger');

module.exports.moneyList = function (opt, cb) {
	if (!opt) return cb(new Error('No option.', 500));
	opt.stock = 0;

	db.checkMoney(opt, function (err, sum) {
		if (err) {
			return cb(err);
		} else {

			var start = (opt.page || 0) * (opt.perPage || 0);
			var perPage = opt.perPage || 0;
			var query = db.format('SELECT * FROM dealer_money WHERE dealer = ? LIMIT ?, ?;' +
				'SELECT count(*) as count FROM dealer_money WHERE dealer = ?;', [opt.dealer.id, start, perPage, opt.dealer.id]);

			db.query(query, function (err, results) {
				if(err) {
					return cb(err);
				} else {
					return cb(null, {
						count: results[1][0].count || 0,
						list: results[0],
						balance: sum
					});
				}
			})
		}
	});
};
