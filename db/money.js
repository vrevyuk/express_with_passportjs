/**
 * Created by glavnyjpolzovatel on 23.02.16.
 */
var db = require('./index');
var log = require('../mylogger');

var Money = function () {};

Money.prototype.find = function (token, start, count, callback) {
	if(!token) return callback(null, 0, 0);
	if (!start) start = 0;
	if (!count) count = 20;
	var query = db.format('SELECT m.* FROM dealer AS d, money AS m WHERE m.dealer_id = d.id AND d.token = ? ORDER BY m.id DESC LIMIT ?, ?',[token, start, count]);
	db.query(query, function (err, result) {
		if(err) {
			return callback(new Error(err, err.errno));
		} else {
			if(result.length == 0) {
				return callback(null, 0, 0);
			} else {
				query = query.replace('m.*', 'COUNT(*), sum(m.sum)').replace('LIMIT ' + start + ', ' + count, '');
				db.query(query, function (err, limitResult, fields) {
					if(err) {
						return callback(new Error(err, err.errno));
					} else {
						return callback(null, limitResult[0][fields[1].name], limitResult[0][fields[0].name], result);
					}
				});
			}
		}
	})
};

module.exports = new Money();