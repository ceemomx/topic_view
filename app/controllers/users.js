//var users_service = require('mount-services')(__dirname).users_service;
var moment = require('moment');
var User = require('../models/users');
// -- custom api
exports.api = {
	login: function (req, res) {
		var _user, username, password;
		username = req.body.username;
		password = req.body.password;
		_user = new User({
			username: username,
			password: password
		});
		return _user.is_exist(function(err, sur) {
			var half_hour;
			if (err) {
				console.dir('error:'+err);
				req.session.current_user = void 0;
				res.api({msg:'登录失败'});
			} else {
				req.session.current_user = sur;
				half_hour = 3600000 / 2;
				req.session.cookie.expires = new Date(Date.now() + half_hour);
				req.session.cookie.maxAge = half_hour;
				console.dir('login-session:'+req.session.current_user);
				res.api(req.session.current_user);
			}
		});
	},
	register: function(req,res){
		var _user,username,password;
		username = req.body.username;
		password = req.body.password;
		console.log(username,password);
		_user = new User({
			username: username,
			password: password
		});
		_user.save(function (err,usr) {
			if(err){
				console.log('error:'+err);
				return res.api(err);
			}else{
				console.log('right:'+usr);
				return res.api(_user);
			}
		});
	},
	userinfo: function (req,res) {
		var _user = req.session.current_user;
		var uid = req.params.uid;
		console.dir('userinfo--'+_user,uid);
		User.findById(_user._id,function (err, info) {
			info = info.toJSON();
			info.created_at = moment(info.created_at).format("YYYY年MM月DD日");
			res.api(info);
			/*res.render('admin/userinfo', {
				title: '个人信息',
				user: info
			})*/
		})
	}
};