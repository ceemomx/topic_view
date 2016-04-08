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
	.controller('IndexCtrl', function ($scope, $http) {
		$http.get(API_URL+'users/userinfo').success(function(data){
			console.log(data);
			if(data.status.code == 0){
				$scope.userinfo = data.data;
			}else{
				alert(data.status.msg);
			}
		})
	})
	//头部
	.controller('HeaderCtrl', function ($scope, $http, $location) {
		$http.get(API_URL+'users/userinfo').success(function(data){
			console.log(data);
			if(data.status.code == 0){
				$scope.userinfo = data.data;
			}else{
				console.log(data.status.msg);
			}
		});
		$scope.log = function(user){
			/*console.log(user);
			if(!user){*/
				$location.url('/login');
			/*}else{
				console.log('logout');
				$http.get(API_URL+'users/logout').success(function(data){
					utils.alert('您已退出登录！');
				})
			}*/
		}
	})
;


