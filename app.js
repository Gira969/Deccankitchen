var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
var logger = require('morgan');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var  csrf = require('csurf');
const Handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
var Mongostore = require('connect-mongo')(session);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

mongoose.connect("mongodb://127.0.0.1:27017/shopping",{ useNewUrlParser: true }, { useUnifiedTopology: true });
require('./config/passport');

// view engine setup

app.set('views' , path.join(__dirname , 'views'));
app.engine('.hbs' ,
expressHbs({defaultLayout : 'layout' ,
extname : '.hbs' ,
layoutDir : __dirname + '/views/layouts/',
handlebars: allowInsecurePrototypeAccess(Handlebars),
}));
app.set('view engine', '.hbs');
app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
// app.use(csrf({ cookie: true }));
app.use(session({
  secret : 'mysupersecret' ,
  resave : false ,
  saveUninitialized : false,
  store:new Mongostore({ mongooseConnection : mongoose.connection}),
  cookie:{ maxAge : 180* 60* 1000 }
}));




app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next){
    res.locals.login = req.isAuthenticated();
    res.locals.session = req.session;
    next();
});
app.use('/', indexRouter);
app.use('/user', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error pagedi
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
