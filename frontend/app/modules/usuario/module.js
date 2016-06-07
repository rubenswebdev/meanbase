(function(){
	"use strict";

    var module = 'usuario';
    var controller = 'UsuarioController';

	angular.module(module, []).config(states);

  	states.$inject = ['$stateProvider', 'LoadingProvider'];

    function states($stateProvider, LoadingProvider) {
        $stateProvider
            .state(module, {
                url: "/usuario",
                views: {
                    '': {
                        templateUrl: LoadingProvider.uncache('app/modules/'+module+'/home.html'),
                        controller: controller,
                        controllerAs: 'vm'
                    },
                    'nav': {
                    	templateUrl: LoadingProvider.uncache('app/templates/nav.html')
                    }
                }
            }).state(module+'.add', {
                url: "/add",
                views: {
                    '': {
                        templateUrl: LoadingProvider.uncache('app/modules/'+module+'/form.html'),
                        controller: controller,
                        controllerAs: 'vm'
                    },
                    'nav': {
                        templateUrl: LoadingProvider.uncache('app/templates/nav.html')
                    }
                }
            }).state(module+'.edit', {
                url: '/edit/:id',
                views: {
                    '': {
                        templateUrl: LoadingProvider.uncache('app/modules/'+module+'/form.html'),
                        controller: controller,
                        controllerAs: 'vm'
                    },
                    'nav': {
                        templateUrl: LoadingProvider.uncache('app/templates/nav.html'),
                    }
                }
            });
    }
})();