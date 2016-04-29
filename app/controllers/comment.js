// var express = require('express');
var mongoose = require('mongoose');
var moment = require('moment');
var Promise = require("bluebird");
/* GET listing. */
var User = require('../models/users');
var Comment = require('../models/comment');

exports.api = {
	comment_post: function (req,res) {
		var user_id = req.session.current_user._id;
		var topic_id = req.body.topic_id;
		var content = req.body.content;
		var post = new Comment({
			user: user_id,
			topic: topic_id,
			content: content
		});
		post.save(function (err,post) {
			if(err){
				console.log('error:'+err);
				return res.api(err);
			}else{
				console.log('right:'+post);
				return res.api(post);
			}
		});
	},
	/** 话题列表 **/
	list: function(req, res){
		var topic = req.params.id;
		var data;
		var json = [];
		Comment.findAsync({topic:topic}).then(function (obj) {
			data = obj;
			var name = [];
			for (var i = 0; i < data.length; i++) {
				name.push(User.findByIdAsync(data[i].user));
			}
			console.log('id------'+topic)
			console.log(obj);
			//return res.api(obj)
			return Promise.all(name)
		})
		.then(function (user) {
			console.log(user);
			for (var i = 0; i < data.length; i++) {
				//console.log('data:' + data[i].user);
				var obj = {
					id:data[i].id,
					uid:user[i].id,
					user_head:user[i].head,
					username:user[i].username,
					comment: data[i].content,
					created_at: moment(data[i].created_at).format("MM-DD HH:mm")
				};
				json.push(obj);
			}
			console.log(json);
			return res.api(json)
		})
		.catch(function (err) {
			return res.api(err)
		});
	}

	/*view: function(req, res){
		var id = req.params.id;
		console.log(id);
		var topic;
		Topic.findByIdAsync(id).then(function(pro){
			topic = pro;
			// console.log(proData)
			return User.findByIdAsync(pro.user)
		}).then(function(user){
			var json = {
				id:id,
				title: topic.title,
				author: user.username,
				content: topic.content,
				created_at: moment(topic.created_at).format("MM-DD HH:mm")
			};
			// console.log(json)
			return res.api(json);
		})
	},*/
};
