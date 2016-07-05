(function () {
'use strict';

angular.module('dashboard')
 .controller('DashboardController', DashboardController);

DashboardController.$inject = [];

function DashboardController() {
    var vm = this;
    var stateDefault = 'dashboard';

    start();

    function start() {

    }
}
})();
