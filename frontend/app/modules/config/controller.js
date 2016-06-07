(function () {
'use strict';
var module = 'config';
angular.module(module)
 .controller('ConfigController', ConfigController);

ConfigController.$inject = ['ApiService', '$state', 'toaster', 'DbService', '$scope', 'myConfig', 'Upload', '$filter'];

function ConfigController(ApiService, $state, toaster, DbService, $scope, myConfig, Upload, $filter) {
    var vm = this;
    var apiRoute = '/v1/financeiro/config/';
    var stateDefault = 'config';

    /*Variaveis*/
    vm.form = {};
    vm.form.contatos = [];
    vm.form.enderecos = [];
    vm.cidades = [];

    vm.save = save;
    vm.addContato = addContato;
    vm.addEndereco = addEndereco;
    vm.getCep = getCep;

    start();

    function start() {

        DbService.getConfig().then(function (response) {
            vm.form = response ? response : {};

            if (!vm.form.contatos) {
                vm.form.contatos = [];
            }

            if (!vm.form.enderecos) {
                vm.form.enderecos = [];
            }

        });
    }

    function save() {

        if (vm.form.issRetido) {
            vm.form.issRetido = 1;
        } else {
            vm.form.issRetido = 2;
        }

        Upload.upload({
                    url: myConfig.api + '/v1/config',
                    data: vm.form,
                    method: 'POST',
                    file: vm.form.upload,
                }).then(function (response) {
                    if (response.data.success) {
                        toaster.pop('success', 'Mensagem', 'Editado com sucesso!');
                        $state.go(stateDefault, {}, { reload: true, inherit: false });
                    }
                });

        /*  if (vm.form._id) {
          ApiService.put(apiRoute, vm.form).then(function(data){
           if (data.success) {
            toaster.pop('success', "Mensagem", "Editado com sucesso!");
                           $state.go(stateDefault, {},{reload: true, inherit: false});
                       } else {
            toaster.pop('error', "Mensagem", "Ocorreu um erro, tente novamente!");
                       }
          });
         } else {
          ApiService.post(apiRoute, vm.form).then(function(data){
           console.log(data);
           if (data.success) {
            toaster.pop('success', "Mensagem", "Salvo com sucesso!");
                           $state.go(stateDefault, {},{reload: true, inherit: false});
                       } else {
            toaster.pop('error', "Mensagem", "Ocorreu um erro, tente novamente!");
                       }
          });
         }*/
    }

    function addContato() {
        var newContato = {};
        newContato.nome = '';
        newContato.email = '';
        newContato.telefone = '';
        newContato.tipo = '';

        vm.form.contatos.push(newContato);
    }

    function addEndereco() {
        var newEndereco = {};
        newEndereco.cep = '';
        newEndereco.logradouro = '';
        newEndereco.bairro = '';
        newEndereco.cidade = '';
        newEndereco.uf = '';
        newEndereco.selectedUF = '';
        newEndereco.ie = '';
        newEndereco.complemento = '';
        newEndereco.numero = '';
        newEndereco.codcidade = '';
        newEndereco.codUf = '';

        vm.form.enderecos.push(newEndereco);
    }

    function getCep(index) {
        var endereco = vm.form.enderecos[index];
        $.get('http://api.postmon.com.br/v1/cep/' + endereco.cep, {}, function (data) {
            console.log(data);
            endereco.logradouro = data.logradouro;
            endereco.bairro = data.bairro;
            endereco.cidade = data.cidade;
            endereco.uf = data.estado;
            endereco.codcidade = data.cidade_info.codigo_ibge;
            endereco.codUf = data.estado_info.codigo_ibge;
            $scope.$apply();
        });
    }
}
})();
