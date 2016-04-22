var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Promise = require('bluebird');

var CommentSchema = new Schema({
	content: {
		type: String
	},
	topic:{
		type: Schema.ObjectId,
		required: true,
		index: true
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
var CommentModel = mongoose.model('CommentModel', CommentSchema);

Promise.promisifyAll(CommentModel);
Promise.promisifyAll(CommentModel.prototype);

module.exports = CommentModel;

