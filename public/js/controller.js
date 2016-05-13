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
		});
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
	.controller('PostTopicCtrl', function ($scope, $http, $location, $timeout) {
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
					console.log(data);
					if(data.status.code == 0){
						utils.alert('发布成功！');
						$timeout(function () {
							$location.url('/');
						},1500)
					}
				})
			}

		}
	})
	//话题详情
	.controller('TopicViewCtrl', function ($scope, $http, $routeParams,$sce,$location, $timeout,$q,server) {
		var id = $routeParams.id;
		console.log(id);
		var deferred = $q.defer();
		var promise = deferred.promise;
		server.getSelf(function (user) {
			$scope.userinfo = user.data;
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
		promise.then(function () {

		});
		$http.get(API_URL+'topic/'+id).success(function (data) {
			//console.log(data);
			if(data.status.code == 0){
				$scope.content = $sce.trustAsHtml(data.data.content);
				$scope.topicView = data.data;
			}
		});
		function commnetList(){
			$http.get(API_URL+'comment/list/'+id).success(function (data) {
				console.log(data);
				if(data.status.code == 0){
					$scope.commentsLen = data.data.length;
					for(var i = 0;i<data.data.length;i++){
						data.data[i].comment = $sce.trustAsHtml(data.data[i].comment);
					}
					$scope.comments = data.data;
				}
			});
		}
		commnetList();
		$scope.submitContent = function () {
			var comment = UE.getEditor("container").getContent();
			console.log(comment);
			$http.post(API_URL+'comment/post',{topic_id:id,content:comment}).success(function (data) {
				console.log(data);
				if(data.status.code == 0){
					utils.alert('发布成功！');
					UE.getEditor("container").setContent('');
					commnetList();
				}
			})
		};
		$scope.deleteTopic = function () {
			console.log(id);
			$http.get(API_URL+'topic/del/'+id).success(function (data) {
				console.log(data);
				if(data.status.code == 0){
					utils.alert('删除成功！');
					$timeout(function () {
						$location.url('/')
					},1500)
				}
			})
		}
	})
	//用户信息
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
					var imgPath = data.data.path.split('public')[1];
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
	.controller('EditTopicCtrl', function ($scope, $http, $routeParams,$timeout,$location) {
		console.log($routeParams.id);
		var id = $routeParams.id;
		UE.getEditor('container',{
			toolbars: [
				[
					'bold',
					'italic',
					'underline',
					'fontsize', //字号
					'indent',
					'insertorderedlist',
					'inserttitle', //插入标题
					'justifyleft', //居左对齐
					'justifyright', //居右对齐
					'justifycenter', //居中对齐
					'justifyjustify', //两端对齐
					'simpleupload', //单图上传
					'source',
					'undo',
					'redo'
				]
			],
			initialFrameWidth:'100%'
		}).ready(function() {
			//
			$http.get(API_URL+'topic/'+id).success(function (data) {
				if(data.status.code == 0){
					console.log(data.data.content);
					UE.getEditor("container").setContent(data.data.content);
					$scope.topicView = data.data;
				}
			});
		});
		$scope.submitContent = function () {
			var query = {
				title:$scope.topicView.title,
				content:UE.getEditor("container").getContent()
			};
			$http.post(API_URL+'topic/edit/'+id,query).success(function (data) {
				console.log(data)
				if(data.status.code == 0){
					utils.alert('修改成功！');
					$timeout(function () {
						$location.url('/topic-view/'+id);
					},1500)
				}
			})
		}
	})
	.controller('AboutCtrl', function ($scope, $http, $timeout, $location, server) {
		server.getSelf(function (user) {
			$scope.userinfo = user.data;
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
	.controller('SidebarCtrl', function ($scope, $http, server) {
		server.getSelf(function (user) {
			$scope.userinfo = user.data;
		});
	})
;


