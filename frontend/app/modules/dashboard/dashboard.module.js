(function(){
	"use strict";

	angular.module('dashboard', []).config(states);

  	states.$inject = ['$stateProvider', 'LoadingProvider'];

    function states($stateProvider, LoadingProvider) {
        $stateProvider
            .state('dashboard', {
                url: "/dashboard",
                views: {
                    '': {
                        templateUrl: LoadingProvider.uncache('app/modules/dashboard/dashboard.html'),
                        controller: 'DashboardController',
                        controllerAs: 'vm'
                    },
                    'nav': {
                    	templateUrl: LoadingProvider.uncache('app/templates/nav.html')
                    }
                }
            });
    }
})();