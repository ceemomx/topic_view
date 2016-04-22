var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Promise = require('bluebird');

var TopicSchema = new Schema({
	title: {
		type: String,
		required: false
	},
	content: {
		type: String
	},
	user: {
		type: Schema.ObjectId,
		required: true,
		index: true
	},
	created_at: {
		type: Date,
		default: Date.now()
	}
});
var TopicModel = mongoose.model('TopicModel', TopicSchema);

Promise.promisifyAll(TopicModel);
Promise.promisifyAll(TopicModel.prototype);

module.exports = TopicModel;

