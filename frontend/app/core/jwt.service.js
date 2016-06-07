(function(){
	"use strict";
	angular.module('core')
		.factory('JwtService', JwtService);

	JwtService.$inject = ["$http", "$q", "myConfig", '$window'];

	function JwtService($http, $q, myConfig, $window) {

		var service = {
			getToken: getToken,
			setToken: setToken
		}

		return service;

		function getToken() {
			return $window.localStorage.token;
		}

		function setToken(tk) {
			$window.localStorage.token = tk;
		}
	}
})();