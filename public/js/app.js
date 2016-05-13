'use strict';
var app = angular.module('App', ['ngRoute', 'ngControllers','ngServer']);
app.config(['$routeProvider','$locationProvider',
	function ($routeProvider,$locationProvider) {
		//$locationProvider.html5Mode(true);
		$routeProvider
			.when('/register', {
				templateUrl: 'templates/register.html',
				controller: 'RegisterCtrl'
			})
			.when('/login', {
				templateUrl: 'templates/login.html',
				controller: 'LoginCtrl'
			})
			.when('/', {
				templateUrl: 'templates/index.html',
				controller: 'IndexCtrl'
			})
			.when('/post-topic', {
				templateUrl: 'templates/post-topic.html',
				controller: 'PostTopicCtrl'
			})
			.when('/topic-view/:id', {
				templateUrl: 'templates/topic-view.html',
				controller: 'TopicViewCtrl'
			})
			.when('/user/:id', {
				templateUrl: 'templates/user.html',
				controller: 'UserCtrl'
			})
			.when('/setting', {
				templateUrl: 'templates/setting.html',
				controller: 'SettingCtrl'
			})
			.when('/edit-topic/:id', {
				templateUrl: 'templates/edit-topic.html',
				controller: 'EditTopicCtrl'
			})
			.otherwise({
				redirectTo: '/'
			});
	}]);