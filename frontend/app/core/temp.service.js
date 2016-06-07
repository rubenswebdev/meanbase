(function(){
	"use strict";
	angular.module('core').
		factory('Temp', Temp);

	function Temp() {
		var data = {};
		return {
			set: set,
			get: get
		}

		function set(key, value) {
			data[key] = value;
		}

		function get(key) {
			return data[key];
		}
	}
})();