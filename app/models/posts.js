var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Promise = require('bluebird');

/**
 列表

 - 用户 user
 - 产品 product
 - 数量 count
 - 最后一次计算时间 last_modified_at
 */
var PostSchema = new Schema({
	post: { // 商品id
		type: Schema.ObjectId,
		required: true,
		index: true
	},
	followings: [{ // id
		type: Schema.ObjectId,
		required: true,
		index: true,
		ref: 'post'
	}],
	post_name: String, //商品名称
	last_modified_at: { //最近修改时间
		type: Date,
		default: Date.now
	}
});
var PostModel = mongoose.model('PostModel', PostSchema);

Promise.promisifyAll(PostModel);
Promise.promisifyAll(PostModel.prototype);

module.exports = PostModel;

