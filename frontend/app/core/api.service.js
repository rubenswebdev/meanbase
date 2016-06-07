(function(){
	"use strict";
	angular.module('core')
		.factory('ApiService', ApiService);

	ApiService.$inject = ["$http", "$q", "myConfig", "$state", 'Upload'];

	function ApiService($http, $q, myConfig, $state, Upload) {

		var service = {
			login: login,
			get: get,
			del: del,
			post: post,
			put: put,
			upload: upload
		}

		return service;

		function login(data) {
			var deferred = $q.defer();
			$http.post(myConfig.api + '/login', data).then(function(response){
				deferred.resolve(response.data);
			}, function(err) {
				deferred.reject(err);
			});
			return deferred.promise;
		}

		function post(url, data) {
			var deferred = $q.defer();
			$http.post(myConfig.api + url, data).then(function(response){
				deferred.resolve(response.data);
			}, function(err) {
				deferred.reject(err);
			});
			return deferred.promise;
		}

		function put(url, data) {
			var deferred = $q.defer();

			 $http({
                url: myConfig.api + url,
	            method: 'PUT',
	            data: data,
	            headers: {
	                'Content-Type': 'application/json'
	            }
	          }).then(function(response){
				deferred.resolve(response.data);
			}, function(err) {
				deferred.reject(err);
			});
			return deferred.promise;
		}

		function get(url) {
			var deferred = $q.defer();
			$http.get(myConfig.api + url).then(function(response){
				deferred.resolve(response.data);
			}, function(err) {
				deferred.reject(err);
			});
			return deferred.promise;
		}

		function del(url) {
			var deferred = $q.defer();
			$http.delete(myConfig.api + url ).then(function(response){
				deferred.resolve(response.data);
			}, function(err) {
				deferred.reject(err);
			});
			return deferred.promise;
		}

		function upload(apiRoute, data, file, method) {
			var deferred = $q.defer();

			var configUpload = {
				url: myConfig.api + apiRoute,
                data: data,
                method: method,
                file: file
            }

            function uploadFinish(response) {
                deferred.resolve(response.data);
            }

			Upload.upload(configUpload).then(uploadFinish);

			return deferred.promise;
		}
	}
})();