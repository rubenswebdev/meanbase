(function () {
'use strict';

angular.module('dashboard')
 .controller('DashboardController', DashboardController);

DashboardController.$inject = ['ApiService', '$state', '$location', 'Temp', '$stateParams', '$scope', '$filter', 'toaster', 'DbService', 'myConfig', 'Lightbox',  '$uibModal'];

function DashboardController(ApiService, $state, $location, Temp, $stateParams, $scope, $filter, toaster, DbService, myConfig, Lightbox,  $uibModal) {
    var vm = this;
    var apiRoute = '/v1/produto/';
    var apiRouteRelatorio = '/v1/dashboard/';
    var stateDefault = 'dashboard';
    vm.filtro = {};

    if (Temp.get('scan')) {
        location.reload();
    }

    vm.form = {};
    vm.form.login = '';
    vm.form.password = '';

    vm.status = {};
    vm.status.success = true;
    vm.status.message = '';

    vm.login = login;
    vm.read = read;
    vm.error = error;

    function error(err) {
        if (err) {
            console.log('error');
        }
    }

    function read(data) {
        Temp.set('scan', true);
        $location.path('/produtos/edit/' + data);
    }

    function login() {
        ApiService.login(vm.form).then(function (data) {
            vm.status = data;
            if (data.success) {
                $state.go('dashboard');
            }
        });
    }

    start();

    function start() {
        /*se veio da rota getDetalhes*/
        var id = $stateParams.id;
        if (id) {
            getItem(id);
            getHistoricoProduto(id);
        }
    }
}
})();
