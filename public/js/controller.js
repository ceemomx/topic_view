//'use strict';
var ngControllers = angular.module('ngControllers', []);
ngControllers
	//注册
	.controller('RegisterCtrl', function ($scope, $http, $timeout, $location) {
		$scope.register = function (user) {
			$http.post(API_URL+'users/register',{username:user.name,password:user.pass}).success(function(data){
				if(data.status.code == 0){
					utils.alert('注册成功，请登录！');
					$timeout(function () {
						$location.url('/login');
					},1500)
				}else{
					utils.alert(data.status.msg);
				}
			})
		}

	})
	//登录
	.controller('LoginCtrl', function ($scope, $http, $timeout, $location) {
		$scope.login = function (user) {
			$http.post(API_URL+'users/login',{username:user.name,password:user.pass}).success(function(data){
				if(data.status.code == 0){
					utils.alert('登录成功!');
					$timeout(function () {
						$location.url('/');
					},1500)
				}else{
					utils.alert(data.status.msg);
				}
			})
		}
	})
	//首页
	.controller('IndexCtrl', function ($scope, $http,$location,$timeout,server) {
		server.getSelf(function (user) {
			console.log(user.data)
			$scope.userinfo = user.data;
		})
		$http.get(API_URL+'topic/list').success(function (data) {
			if(data.status.code == 0){
				$scope.topic_list = data.data;
			}else{
				utils.alert(data.status.msg);
			}
		});
		$scope.log = function(user){
			console.log(user);
			if(!user){
				$location.url('/login');
			}else{
				console.log('logout');
				$http.get(API_URL+'users/logout').success(function(data){
					console.log(data);
					utils.alert('您已退出登录！');
					$timeout(function () {
						window.location.reload();
					},1000)
				})
			}
		}
	})
	//发布话题
	.controller('PostTopicCtrl', function ($scope, $http) {
		$scope.submitContent = function () {
			console.log(UE.getEditor("container").getContent());
			var container = UE.getEditor("container").getContent();
			var topic = {
				title : $('#title').val(),
				content: container
			};
			$http.post(API_URL+'topic/post',topic).success(function (data) {
				console.log(data)
				if(data.status.code == 0){
					utils.alert('发布成功！');
				}
			})
		}
	})//发布话题
	.controller('PostTopicCtrl', function ($scope, $http) {
		$scope.submitContent = function () {
			console.log(UE.getEditor("container").getContent());
			var container = UE.getEditor("container").getContent();
			var topic = {
				title : $('#title').val(),
				content: container
			};
			if(!topic.title){
				utils.alert('请输入标题')
			}else if(!topic.content){
				utils.alert('请输入内容')
			}else{
				$http.post(API_URL+'topic/post',topic).success(function (data) {
					console.log(data)
					if(data.status.code == 0){
						utils.alert('发布成功！');
					}
				})
			}

		}
	})
	//话题详情
	.controller('TopicViewCtrl', function ($scope, $http, $routeParams,$sce) {
		var id = $routeParams.id;
		$http.get(API_URL+'topic/'+id).success(function (data) {
			console.log(data);
			if(data.status.code == 0){
				$scope.content = $sce.trustAsHtml(data.data.content);
				$scope.topicView = data.data;
			}
		})
	})
	//话题详情
	.controller('UserCtrl', function ($scope, $http, $routeParams) {
		var id = $routeParams.id;
		$http.get(API_URL+'users/userinfo/'+id).success(function (data) {
			console.log(data);
			if(data.status.code == 0){
				$scope.user = data.data;
			}
		});
		$http.get(API_URL+'topic/list/'+id).success(function (data) {
			console.log(data);
			if(data.status.code == 0){
				$scope.topic = data.data;
			}
		})
	})
	//设置
	.controller('SettingCtrl', function ($scope, $http,$timeout, $location,$rootScope, server) {
		/*var ul = 'public/uploads/jq0111460380974073.jpg';
		console.log(ul.split('public')[1]);*/
		server.getSelf(function (data) {
			console.log(data);
			$scope.user = data.data;
		});
		$('#upfile').on('change',function () {
			$('#editfile').submit(function (e) {
				$http({
					url: API_URL+'uploadimage',
					method: 'POST',
					headers: {
						'Content-Type': undefined
					},
					transformRequest: function() {
						var formData = new FormData();
						formData.append('file', $('#upfile')[0].files[0]);
						return formData;
					}
				}).success(function (data) {
					console.log(data);   //返回上传后所在的路径
					var imgPath = data.file.path.split('public')[1];
					$('#head-url').attr('src',imgPath);
					$rootScope.userinfo = {
						head: imgPath
					};
				});
				e.preventDefault();
			});
			$('#editfile').trigger('submit');
		});
		$scope.setting = function (user) {
			var query = {
				sex:user.sex,
				address:user.address,
				signature:user.signature,
				weibo:user.weibo,
				website:user.website
			};
			console.log(query);
			$http.post(API_URL+'users/setting', query).success(function (data) {
				console.log(data);
				if(data.status.code == 0){
					utils.alert('保存成功！')
				}
			});
		};
		$scope.log = function(user){
			console.log('logout');
			$http.get(API_URL+'users/logout').success(function(data){
				console.log(data);
				utils.alert('您已退出登录！');
				$timeout(function () {
					$location.url('/login');
				},1000)
			})
		}
	})
;


