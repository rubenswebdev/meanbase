(function(){
	"use strict";

	angular.module('core')

		.provider('Loading', LoadingProvider);

	LoadingProvider.$inject = ['$injector'];

	function LoadingProvider($injector) {

		var coreConfig = $injector.get('coreConfig');
		var url;

	    return {
	    	uncache: function(url) {
    		 	var cacheBuster = Date.now().toString();

    		 	if (!coreConfig.cache) {
	    			url = url+"?v="+cacheBuster;
    		 	}

	    		return url;
	    	},

	    	$get: function() {
	            return {
	                url : url
	            }
	        }
	    }
	}

})();