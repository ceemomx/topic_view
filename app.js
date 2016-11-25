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
var ueditor = require("ueditor");
var multer  = require('multer');

var routes = require('./app/routes/index');
var users = require('./app/routes/users');

require('./db');

var app = express();
//上传
app.use(multer({
	dest: './public/uploads/',
	rename: function (fieldname, filename) {
		return filename.replace(/\W+/g, '-').toLowerCase() + Date.now()
	}
}));

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

var half_hour = 60 * 1000 * 60 * 12;
app.use(session({
	store: new MongoStore({ mongooseConnection: mongoose.connection }),
	secret: 'kz-bbs@me',
	resave: true,
	saveUninitialized: false,
	cookie: {
		maxAge: half_hour
	}
}));

app.use('/', routes);
app.use('/users', users);

// /ueditor 入口地址配置 https://github.com/netpi/ueditor/blob/master/example/public/ueditor/ueditor.config.js
// 官方例子是这样的 serverUrl: URL + "php/controller.php"
// 我们要把它改成 serverUrl: URL + 'ue'
app.use("/ueditor/ue", ueditor(path.join(__dirname, 'public'), function(req, res, next) {
	console.log('ueditor here');
	// ueditor 客户发起上传图片请求
	if(req.query.action === 'uploadimage'){
		// 这里你可以获得上传图片的信息
		var foo = req.ueditor;
		console.log('****readyuploadimage****');
		console.log(foo.filename); // exp.png
		console.log(foo.encoding); // 7bit
		console.log(foo.mimetype); // image/png

		// 下面填写你要把图片保存到的路径 （ 以 path.join(__dirname, 'public') 作为根路径）
		var img_url = '/uploads';
		res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
	}
	//  客户端发起图片列表请求
	else if (req.query.action === 'listimage'){
		var dir_url = 'your img_dir'; // 要展示给客户端的文件夹路径
		res.ue_list(dir_url) // 客户端会列出 dir_url 目录下的所有图片
	}
	// 客户端发起其它请求
	else {

		res.setHeader('Content-Type', 'application/json');
		// 这里填写 ueditor.config.json 这个文件的路径
		res.redirect('/ueditor/ueditor.config.json')
	}
}));
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
