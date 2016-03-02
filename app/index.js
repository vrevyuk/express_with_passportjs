/**
 * Created by vitaly on 16.02.16.
 */
var log = require('./../mylogger/index');
var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var conf = require('nconf');
conf.env().file({file: './config/index.json'});

var app = express();
app.tcpport = conf.get('network:port');

var router = require('./../router/index');
var profile = require('./../router/profile');
var money = require('./../router/money');
var news = require('./../router/news');
var code = require('./../router/code');
var promo = require('./../router/promo');
var directpay = require('./../router/directpay');


var db = require('./../db/user');
var jade = require('jade');

app.set('view engine', 'jade');
app.set('views', './views');
app.use(express.static('./static'));

passport.use(new LocalStrategy(function (username, password, done) {
    //log(username, password);
    db.findByLoginPassword(username, password, function (err, user) {
        return done(err, user);
    });
}));

passport.serializeUser(function (user, done) {
    done(null, user.token);
});

passport.deserializeUser(function (usertoken, done) {
    db.findByToken(usertoken, function (err, user) {
        if (err) return done(err);
        done(null, user);
    });
});

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({secret: 'keyboard cat', resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());
app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));
app.get('/login', function (req, res) {
    res.render('login');
});

app.use(function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
});
app.use('/', router);
app.use('/profile', profile);
app.use('/money', money);
app.use('/news', news);
app.use('/code', code);
app.use('/promo', promo);
app.use('/directpay', directpay);

app.use(require('./../error404'));
app.use(require('./../error500'));

module.exports = app;
