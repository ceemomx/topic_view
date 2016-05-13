// var express = require('express');
var mongoose = require('mongoose');
var moment = require('moment');
var Promise = require("bluebird");
/* GET listing. */
var User = require('../models/users');
var Topic = require('../models/topic');

exports.api = {
	topic_post: function (req,res) {
		var user_id = req.session.current_user._id;
		var title = req.body.title;
		var content = req.body.content;
		var post = new Topic({
			user: user_id,
			title: title,
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
	topic_list: function(req, res){
		var uid = req.params.id;
		if(!uid){
			var data;
			var json = [];
			Topic.findAsync({}).then(function (obj) {
				data = obj;
				var name = [];
				for (var i = 0; i < data.length; i++) {
					name.push(User.findByIdAsync(data[i].user));
				}
				return Promise.all(name)
			})
				.then(function (user) {
					console.log('user'+user);
					for (var i = 0; i < data.length; i++) {
						//console.log('data:' + data[i].user);
						var obj = {
							id:data[i].id,
							uid:user[i].id,
							user_head:user[i].head,
							title: data[i].title,
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
		}else{
			Topic.findAsync({user:uid}).then(function (data) {
				var json = [];
				for (var i = 0; i < data.length; i++) {
					var obj = {
						id:data[i].id,
						title: data[i].title,
						created_at: moment(data[i].created_at).format("MM-DD HH:mm")
					};
					json.push(obj);
				}
				return res.api(json);
			}).catch(function (err) {
				return res.api(err)
			});
		}

	},
	/** 话题详情 **/
	view: function(req, res){
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
	},
	del: function (req, res) {
		var id = req.params.id;
		Topic.removeAsync({_id:id}).then(function() {
			console.log(id);
			res.status(200).json({
				data:{},
				status:{
					code:0,
					msg:"success"
				}
			});
		}).catch(function (err) {
			return res.api(err)
		});
	},
	edit: function (req,res) {
		var id = req.params.id;
		var query = {
			title:req.body.title,
			content:req.body.content
		};
		Topic.findByIdAndUpdateAsync(id,{$set:query}).then(function (req) {
			console.log(req)
			return res.api(req);
		})
	}
};
