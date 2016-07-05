(function () {
'use strict';
var module = 'config';
angular.module(module)
 .controller('ConfigController', ConfigController);

ConfigController.$inject = ['ApiService', '$state', 'toaster', 'DbService', 'myConfig', 'Upload'];

function ConfigController(ApiService, $state, toaster, DbService, myConfig, Upload) {
    var vm = this;
    var apiRoute = myConfig.api + '/v1/config';
    var stateDefault = 'config';

    /*Variaveis*/
    vm.form = {};

    vm.save = save;

    start();

    function start() {
        DbService.getConfig().then(function (response) {
            vm.form = response ? response : {};
        });
    }

    function save() {

        Upload.upload({
            url: apiRoute,
            data: vm.form,
            method: 'POST',
            file: vm.form.upload,
        }).then(function (response) {
            if (response.data.success) {
                toaster.pop('success', 'Mensagem', 'Editado com sucesso!');
                $state.go(stateDefault, {}, { reload: true, inherit: false });
            }
        });

    }
}
})();
