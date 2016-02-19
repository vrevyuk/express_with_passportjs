/**
 * Created by vitaly on 16.02.16.
 */
var log = require('./mylogger');
var express = require('express');
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var conf = require('nconf');
conf.env().file({file: './config/index.json'});
var app = express();

var router = require('./router');
var profile = require('./router/profile');
var money = require('./router/money');


var db = require('./db');
var jade = require('jade');

app.set('view engine', 'jade');
app.set('views', './views');
app.use(express.static('./static'));


passport.use(new BasicStrategy(function (username, password, done) {
    db.user.findByLoginPassword(username, password, function(err, user) {
        if(err) return done(err);
        if(!err && !user) return done(null, null);
        return done(null, user);
    });
}));

passport.serializeUser(function (user, done) {
    done(null, user.token);
});

passport.deserializeUser(function (usertoken, done) {
    db.user.findByToken(usertoken, function (err, user) {
        if (err) return done(err);
        done(null, user);
    });
});

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({secret: 'keyboard cat', resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/login', passport.authenticate('basic', {session: true}), function (req, res, next) {
    res.redirect('/');
});

app.use('/', router);
app.use('/profile', profile);
app.use('/money', money);


app.use(require('./error404'));
app.use(require('./error500'));

app.listen(conf.get('network:port'), function (err) {
    if(err) {
        log.error('Error running: ' + err.message);
    } else {
        log.info(new Date() + ' Server started on ' + conf.get('network:port') + '.');
    }
});