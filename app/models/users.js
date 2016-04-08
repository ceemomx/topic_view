var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Promise = require('bluebird');

var UserSchema = new Schema({
	username: {// 用户名
		type: String,
		required: true,
		index: {
			unique: true
		}
	},
	password: { // 密码
		type: String,
		required: false
	},
	signature: String, //个性签名
	phone_number: Number, // 电话号码
	address: String, // 地址
	sex: String,//  性别 0->女 1->男
	created_at: {
		type: Date,
		"default": Date.now
	}
});

UserSchema.methods.is_exist = function (cb) {
	var query;
	query = {
		username: this.username,
		password: this.password
	};
	return this.model('UserModel').findOne(query, cb);
};

UserSchema.statics.findAll = function (cb) {
	return this.find().sort({created_at: 'asc'}).exec(cb);
};
var UserModel = mongoose.model('UserModel', UserSchema);

Promise.promisifyAll(UserModel);
Promise.promisifyAll(UserModel.prototype);

module.exports = UserModel;
