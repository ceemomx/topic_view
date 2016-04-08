var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Promise = require('bluebird');

/**
 列表
 */
var TopicSchema = new Schema({
	topic: { // 商品id
		type: Schema.ObjectId,
		required: true,
		index: true
	},
	followings: [{ // id
		type: Schema.ObjectId,
		required: true,
		index: true,
		ref: 'topic'
	}],
	topic_name: String, //商品名称
	last_modified_at: { //最近修改时间
		type: Date,
		default: Date.now
	}
});
var TopicModel = mongoose.model('TopicModel', TopicSchema);

Promise.promisifyAll(TopicModel);
Promise.promisifyAll(TopicModel.prototype);

module.exports = TopicModel;

