// var express = require('express');
var mongoose = require('mongoose');
var moment = require('moment');
var Promise = require("bluebird");
/* GET listing. */
var posts = require('../models/posts');

exports.api = {
	/** 库存列表 **/
	posts_list: function(req, res){
		//var posts = req.model.PostModel;
		posts.findAsync({}).then(function(data){
			console.log('list:'+data);
			var json = [];
			for(var i = 0; i < data.length; i++) {
		        var obj = {
		        	id:data[i]._id,
					title: user[i].username,
                	last_modified_at: moment(data[i].last_modified_at).format("YYYY-MM-DD HH:mm")
		        };
		        json.push(obj);
		    }
		    console.log(json)
		return res.api(json)
		})
		.catch(function(err) {
			return res.api(err)
		})
	}
	/** 库存商品详情 **/
	/*view: function(req, res){
		var id = req.params.id;
		console.log(id)
		var proData;

		Product.findByIdAsync(id).then(function(pro){
			proData = pro;
			// console.log(proData)
			return User.findByIdAsync(pro.user)
		}).then(function(user){
			var json = {
				id:id,
				productName: proData.name,
				sendUser: user.username,
				count: proData.count?proData.count:'暂无',
				stockPosition:'暂无',
				productSize:'暂无',
				SKU:'暂无',
				unitWeight:proData.unit_weight?proData.unit_weight:'暂无',
				productRemark:proData.remark?proData.remark:'暂无'
			}
			// console.log(json)
			return res.api(json);
		})
	}*/
};
