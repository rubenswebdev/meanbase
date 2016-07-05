(function () {
'use strict';

/**
   * Config for the router
   */
angular.module('app', [
    'ui.router',
    'ui.bootstrap',
    'ngSanitize',
    'ui.utils.masks',
    'idf.br-filters',
    'toaster',
    'bootstrapLightbox',
    'angular.morris-chart',
    'core',
    'ngMap',
    'login',
    'dashboard',
    'usuario',
    'config',
])

.filter('nl2br', ['$sanitize', function ($sanitize) {
        var tag = (/xhtml/i).test(document.doctype) ? '<br />' : '<br>';
        return function (msg) {
            msg = (msg + '').replace(/(\r\n|\n\r|\r|\n|&#10;&#13;|&#13;&#10;|&#10;|&#13;)/g, tag + '$1');
            return $sanitize(msg);
        };
    },
])

.config(configuration);

configuration.$inject = ['$urlRouterProvider'];

function configuration($urlRouterProvider) {
    $urlRouterProvider.otherwise('/dashboard');
}

angular.module('app').factory('authInterceptor', authInterceptor);

authInterceptor.$inject = ['$rootScope', '$q', '$window', '$location'];
function authInterceptor($rootScope, $q, $window, $location) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.localStorage.token) {
                config.headers.Authorization = $window.localStorage.token;
            }

            return config;
        },

        response: function (response) {
            if (response.status === 401 || response.data.login === true) {
                $window.localStorage.token = '';
                $location.path('/login');

                // handle the case where the user is not authenticated
            }

            return response || $q.when(response);
        },
    };
}

/*Injeta Autenticação*/
angular.module('app').config(injectAuth);

injectAuth.$inject = ['$httpProvider'];

function injectAuth($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
}

/*Set de token a cada request*/
angular.module('app').run(setToken);

setToken.$inject = ['$rootScope', 'JwtService', '$location', '$state'];

function setToken($rootScope, JwtService, $location, $state) {

    // This events gets triggered on refresh or URL change
    $rootScope.$on('$locationChangeStart', function () {
        if ($location.search().token) {
            JwtService.setToken($location.search().token);
        }

        /*ADD VALIDACAO FAZER O QUE QUISER COM O TOKEN*/
        if ((!JwtService.getToken() || JwtService.getToken() == 'null')) {
            $location.path('/login');
        }
    });
}

angular.module('app').run(validateFilter);

validateFilter.$inject = ['$window'];

function validateFilter($window) {
    var code = 'E';

    if ($window.localStorage.code !== code) {
        $window.localStorage.removeItem('filtro');
        $window.localStorage.removeItem('filtroCompra');
        $window.localStorage.removeItem('filtroContrato');
        $window.localStorage.removeItem('filtroFluxo');
        $window.localStorage.removeItem('filtroOrcamentos');
        $window.localStorage.removeItem('filtroReceitas');
        $window.localStorage.removeItem('filtroVendas');
        $window.localStorage.removeItem('filtroTransferencia');
        $window.localStorage.removeItem('filtroBalancete');
    }

    $window.localStorage.code = code;
}
})();
