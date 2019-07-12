var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js'))); // redirect bootstrap JS
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist/'))); // redirect jQuery
app.use('/js', express.static(path.join(__dirname, 'node_modules/d3/dist/'))); // redirect D3
app.use('/js', express.static(path.join(__dirname, 'node_modules/socket.io-client/dist'))); // redirect socket.io
app.use('/js', express.static(path.join(__dirname, 'node_modules/moment/min'))); // redirect moment.js
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css/'))); // redirect CSS bootstrap

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
