angular.module('ngServer', [])
	.factory("server", function ($cacheFactory, $q, $http) {
		var cache = window.cache = $cacheFactory('userinfo');
		return {
			getSelf: function (fn) {
				$http.get(API_URL+'users/userinfo').success(function(data){
					if(data.status.code == 0){
						if (!cache.get('user')) {
							cache.put('user', data);
						}
						console.log(cache.get('user'));
						fn&&fn(cache.get('user'));
					}else{
						console.log(data.status.msg);
					}
				});
				return fn
			}
		}
	})
;
