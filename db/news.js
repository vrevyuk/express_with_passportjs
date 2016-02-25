/**
 * Created by glavnyjpolzovatel on 23.02.16.
 */
var db = require('./index');
var log = require('../mylogger');

var News = function () { };

News.prototype.fetch = function (options, callback) {
	if(typeof options === 'function') {
		callback = options;
		options = {};
	}

	var query = db.format('SELECT * FROM news ORDER BY id DESC LIMIT 0, ?', [options.limit || 10]);
	db.query(query, function (err, result) {
		if(err) {
			callback(new Error(err.message, err.errno));
		} else {
			callback(null, result);
		}
	});
};

module.exports = new News();