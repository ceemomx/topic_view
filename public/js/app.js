var app = angular.module('App', ['ngRoute', 'ngControllers']);
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
			.when('/header', {
				templateUrl: 'templates/header.html',
				//controller: 'HeaderCtrl'
			})
			.otherwise({
				redirectTo: '/'
			});
	}]);