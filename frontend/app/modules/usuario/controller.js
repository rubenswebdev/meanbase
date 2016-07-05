(function () {
'use strict';
var module = 'usuario';
angular.module(module)
 .controller('UsuarioController', UsuarioController);

UsuarioController.$inject = ['ApiService', '$state', '$stateParams', '$scope', '$filter', 'toaster'];

function UsuarioController(ApiService, $state, $stateParams, $scope, $filter, toaster) {
    var vm = this;
    var apiRoute = '/v1/usuario/';
    var stateDefault = 'usuario';

    /*Variaveis*/
    vm.lista = [];
    vm.total = 0;
    vm.form = {};
    vm.form.tipo = 'O';
    vm.filtro = '';

    /*Paginacao*/
    vm.pagination = {};
    vm.pagination.currentPage = 1;
    vm.pagination.itemsPerPage = 25;
    vm.pagination.total = 0;

    vm.save = save;
    vm.selectAll = selectAll;
    vm.excluir = excluir;
    vm.nothingSelected = nothingSelected;
    vm.filtrar = filtrar;
    vm.reset = reset;

    function reset() {
        if (vm.filtro === '') {
            filtrar();
        }
    }

    $scope.$watch('vm.pagination.currentPage + vm.pagination.itemsPerPage', function () {
        var skip = ((vm.pagination.currentPage - 1) * vm.pagination.itemsPerPage);
        var limit = vm.pagination.itemsPerPage;
        filtrar(skip, limit);
    });

    start();

    function start() {
        /*se veio da rota editar*/
        var id = $stateParams.id;
        if (id) {
            getItem(id);
        }

        filtrar();
    }

    function filtrar(skip, limit) {
        skip = skip || 0;
        limit = limit ||  vm.pagination.itemsPerPage;

        ApiService.get(apiRoute + skip + '/' + limit + '/' + vm.filtro).then(function (response) {
            vm.lista = response.data;
            vm.pagination.total = response.total;
        });

    }

    function getItem(id) {
        ApiService.get(apiRoute + id).then(function (data) {
            vm.form = data;
        });
    }

    function save() {
        if (vm.form._id) {

            if (vm.form.password === '' || vm.form.password2 === '') {
                delete vm.form.password;
                delete vm.form.password2;
            }

            ApiService.put(apiRoute, vm.form).then(function (data) {
                if (data.success) {
                    toaster.pop('success', 'Mensagem', 'Editado com sucesso!');
                    $state.go(stateDefault, {}, { reload: true, inherit: false });
                } else {
                    toaster.pop('error', 'Mensagem', 'Ocorreu um erro, tente novamente!');
                }
            });
        } else {
            ApiService.post(apiRoute, vm.form).then(function (data) {
                console.log(data);
                if (data.success) {
                    toaster.pop('success', 'Mensagem', 'Salvo com sucesso!');
                    $state.go(stateDefault, {}, { reload: true, inherit: false });
                } else {
                    toaster.pop('error', 'Mensagem', 'Ocorreu um erro, tente novamente!');
                }
            });
        }
    }

    function selectAll() {
        for (var i = vm.lista.length - 1; i >= 0; i--) {
            vm.lista[i].selecionado = vm.selector;
        };
    }

    function excluir() {
        for (var i = vm.lista.length - 1; i >= 0; i--) {
            if (vm.lista[i].selecionado) {
                ApiService.del(apiRoute + vm.lista[i]._id).then(function (data) {
                    if (data.ok) {
                        toaster.pop('success', 'Mensagem', 'Excluido com sucesso!');
                    }
                });
            }
        };

        $state.go(stateDefault, {}, { reload: true, inherit: false });
    }

    function nothingSelected() {
        for (var i = vm.lista.length - 1; i >= 0; i--) {
            if (vm.lista[i].selecionado) {
                return false;
            }
        };

        return true;
    }
}
})();
