var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session      = require('express-session');
var MongoStore   = require('connect-mongo')(session);
var mongoose     = require('mongoose');
var res_api      = require('res.api');

var routes = require('./app/routes/index');
var users = require('./app/routes/users');

require('./db');

var app = express();
app.use(res_api);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('view options', {
	pretty: true,
	debug: true,
	cache: true,
	compileDebug: true
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var half_hour = 3600000 / 2;
app.use(session({
	store: new MongoStore({ mongooseConnection: mongoose.connection }),
	secret: 'kz-bbs@me',
	cookie: {
		maxAge: half_hour
	}
}));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var debug = require('debug')('kz-bbs');
app.set('port', process.env.PORT || 3001);
var server = app.listen(app.get('port'), function() {
	debug('Express server listening on port ' + server.address().port);
});

module.exports = app;
