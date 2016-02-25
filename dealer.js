/**
 * Created by glavnyjpolzovatel on 25.02.16.
 */

var app = require('./app');
var log = require('./mylogger/index');


app.listen(app.tcpport, function (err) {
	if(err) {
		log('Error running: ' + err.message);
	} else {
		log(new Date() + ' Server started on ' + app.tcpport + '.');
	}
});
