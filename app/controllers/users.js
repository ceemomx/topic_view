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
			if (err) {
				console.dir('error:'+err);
				res.api({code:1,msg:'登录失败'});
			} else {
				req.session.current_user = sur;
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
		var uid = req.params.id;
		console.dir('userid--'+uid);
		if(!uid){
			var _user = req.session.current_user;
			console.dir('userinfo--'+_user);
			User.findById(_user._id,function (err, info) {
				info = info.toJSON();
				info.created_at = moment(info.created_at).format("YYYY年MM月DD日");
				res.api(info);
			})
		}else{
			User.findById(uid,function (err, info) {
				info = info.toJSON();
				info.created_at = moment(info.created_at).format("YYYY年MM月DD日");
				res.api(info);
			})
		}
	},
	setting: function (req,res) {
		var _user = req.session.current_user;
		console.dir('setuser--'+_user);
		var query = {
			sex:req.body.sex,
			address:req.body.address,
			signature:req.body.signature,
			weibo:req.body.weibo,
			website:req.body.website
		};
		User.findByIdAndUpdate(_user._id,{$set:query},function (err, info) {
			if(err){
				console.log('error:'+err);
				return res.api({
					status:{
						code: 1,
						msg:'保存失败！'
					}
				});
			}else{
				res.api(info);
			}
		})
	},
	uploadimage:function(req,res){
		var user = req.session.current_user;
		if(req.files.file.path){
			var imgPath = req.files.file.path.replace(/public/,'');
			console.log(imgPath);
			User.findByIdAndUpdate(user._id, {$set:{head: imgPath}},function(){
				res.status(200).json({
					data:{path:req.files.file.path},
					status:{
						code:0,
						msg:'上传成功'
					}
				});
			})
		}

	},
	logout: function (req,res) {
		req.session.destroy(function(err) {
			res.api(err);
		})
	}
};