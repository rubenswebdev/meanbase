(function () {
'use strict';

var module = 'config';
var controller = 'ConfigController';

angular.module(module, ['ngFileUpload']).config(states);

states.$inject = ['$stateProvider', 'LoadingProvider'];

function states($stateProvider, LoadingProvider) {
    $stateProvider
        .state(module, {
            url: '/config',
            views: {
                '': {
                    templateUrl: LoadingProvider.uncache('app/modules/' + module + '/home.html'),
                    controller: controller,
                    controllerAs: 'vm',
                },
                nav: {
                    templateUrl: LoadingProvider.uncache('app/templates/nav.html'),
                },
            },
        });
}
})();
