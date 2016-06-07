(function () {
    'use strict';
    angular.module('core')
        .factory('DbService', DbService);

    DbService.$inject = ['ApiService', '$q'];

    function DbService(ApiService, $q) {

        var service = {
            getCategorias: getCategorias,
            getBancos: getBancos,
            getTipos: getTipos,
            getConfig: getConfig,
            getFormaPagamentos: getFormaPagamentos,
            getCaixas: getCaixas,
            getClientes: getClientes,
            getLeads: getLeads,
            getFornecedores: getFornecedores,
            getRamoAtividade: getRamoAtividade,
            getProfissoes: getProfissoes,
            getUnidades: getUnidades,
            getProdutos: getProdutos,
            getProdutosLocacao: getProdutosLocacao,
            getParcelamentos: getParcelamentos,
            getSituacoes: getSituacoes,
            getMarcas: getMarcas,
            getNbss: getNbss,
            getPdfOrcamento: getPdfOrcamento,
            getGrupos: getGrupos,
            getSubGrupos: getSubGrupos,
            getClasses: getClasses,
            getFrete: getFrete,
            saveFrete: saveFrete,
            getCidades: getCidades,
            getFuncionarios: getFuncionarios,
            getHistoricoProduto: getHistoricoProduto,
            getResumoAcabados: getResumoAcabados,
            agendarDevolucao: agendarDevolucao,
            getProdutosAcabados: getProdutosAcabados,
            getTransportadoras: getTransportadoras,
            getCfop: getCfop,
            getCnae: getCnae,
            getTags: getTags,

            // Save as XLS
            exportData: exportData,
        };

        return service;

        function getCategorias(tipo) {
            tipo = tipo || '';
            var deferred = $q.defer();
            ApiService.get('/v1/categoria/all/' + tipo).then(function (response) {
                deferred.resolve(response.data);
            });

            return deferred.promise;
        }

        function getBancos() {
            var deferred = $q.defer();
            ApiService.get('/v1/financeiro/banco/all').then(function (response) {
                deferred.resolve(response.data);
            });

            return deferred.promise;
        }

        function getTipos() {
            var deferred = $q.defer();
            ApiService.get('/v1/tipo-contato').then(function (response) {
                deferred.resolve(response.data);
            });

            return deferred.promise;
        }

        function getConfig() {
            var deferred = $q.defer();
            ApiService.get('/v1/config').then(function (response) {
                deferred.resolve(response.data);
            });

            return deferred.promise;
        }

        function getFormaPagamentos() {
            var deferred = $q.defer();
            ApiService.get('/v1/financeiro/tipo-pagamento/all').then(function (response) {
                deferred.resolve(response.data);
            });

            return deferred.promise;
        }

        function getCaixas() {
            var deferred = $q.defer();
            ApiService.get('/v1/financeiro/caixa/all').then(function (response) {
                deferred.resolve(response.data);
            });

            return deferred.promise;
        }

        function getClientes() {
            var deferred = $q.defer();
            ApiService.get('/v1/cadastro/clientes').then(function (response) {
                    deferred.resolve(response.data);
                });

            return deferred.promise;
        }

        function getLeads() {
            var deferred = $q.defer();
            ApiService.get('/v1/cadastro/clientes/lead').then(function (response) {
                    deferred.resolve(response.data);
                });

            return deferred.promise;
        }

        function getRamoAtividade() {
            var deferred = $q.defer();
            ApiService.get('/v1/ramo-atividade/all').then(function (response) {
                deferred.resolve(response.data);
            });

            return deferred.promise;
        }

        function getFornecedores() {
            var deferred = $q.defer();
            ApiService.get('/v1/cadastro/fornecedores').then(function (response) {
                    deferred.resolve(response.data);
                });

            return deferred.promise;
        }

        function getProfissoes() {
            var deferred = $q.defer();
            ApiService.get('/v1/profissao/all').then(function (response) {
                deferred.resolve(response.data);
            });

            return deferred.promise;
        }

        function getUnidades() {
            var deferred = $q.defer();
            ApiService.get('/v1/unidade/all').then(function (response) {
                deferred.resolve(response.data);
            });

            return deferred.promise;
        }

        function getProdutos() {
            var deferred = $q.defer();
            ApiService.get('/v1/produto/all').then(function (response) {
                deferred.resolve(response.data);
            });

            return deferred.promise;
        }

        function getProdutosAcabados() {
            var deferred = $q.defer();
            ApiService.get('/v1/produto/all/acabados').then(function (response) {
                deferred.resolve(response.data);
            });

            return deferred.promise;
        }

        function getProdutosLocacao() {
            var deferred = $q.defer();
            ApiService.get('/v1/produto/all/locacao').then(function (response) {
                deferred.resolve(response.data);
            });

            return deferred.promise;
        }

        function getParcelamentos() {
            var deferred = $q.defer();
            ApiService.get('/v1/financeiro/parcelamento/all').then(function (response) {
                deferred.resolve(response.data);
            });

            return deferred.promise;
        }

        function getSituacoes(tipo) {
            var deferred = $q.defer();
            tipo = tipo || '';
            ApiService.get('/v1/situacao/all/' + tipo).then(function (response) {
                deferred.resolve(response.data);
            });

            return deferred.promise;
        }

        function getMarcas() {
            var deferred = $q.defer();
            ApiService.get('/v1/marca/all/').then(function (response) {
                deferred.resolve(response.data);
            });

            return deferred.promise;
        }

        function getNbss() {
            var deferred = $q.defer();
            ApiService.get('/v1/nbs/all/').then(function (response) {
                deferred.resolve(response.data);
            });

            return deferred.promise;
        }

        function getPdfOrcamento(id) {
            var deferred = $q.defer();
            ApiService.get('/v1/orcamento/pdf/' + id).then(function (response) {
                deferred.resolve(response.data);
            });

            return deferred.promise;
        }

        function getPdfContrato(id) {
            var deferred = $q.defer();
            ApiService.get('/v1/contrato/pdf/' + id).then(function (response) {
                deferred.resolve(response.data);
            });

            return deferred.promise;
        }

        function getGrupos(classe) {
            var deferred = $q.defer();
            ApiService.get('/v1/grupo/classe/' + classe).then(function (response) {
                deferred.resolve(response.data);
            });

            return deferred.promise;
        }

        function getSubGrupos(grupo) {
            var deferred = $q.defer();
            ApiService.get('/v1/subgrupo/grupo/' + grupo).then(function (response) {
                deferred.resolve(response.data);
            });

            return deferred.promise;
        }

        function getFrete(form) {
            var deferred = $q.defer();
            ApiService.get('/v1/frete/buscar/' + JSON.stringify(form)).then(function (response) {
                deferred.resolve(response.data);
            });

            return deferred.promise;
        }

        function saveFrete(formModal) {
            var deferred = $q.defer();
            ApiService.post('/v1/frete/', formModal).then(function (response) {
                deferred.resolve(response.data);
            });

            return deferred.promise;
        }

        function getClasses() {
            var deferred = $q.defer();
            ApiService.get('/v1/classe').then(function (response) {
                deferred.resolve(response.data);
            });

            return deferred.promise;
        }

        function getCidades(estado) {
            var deferred = $q.defer();
            ApiService.get('/v1/cidade/all/' + estado).then(function (response) {
                deferred.resolve(response.data);
            });

            return deferred.promise;
        }

        function getFuncionarios() {
            var deferred = $q.defer();
            ApiService.get('/v1/funcionario').then(function (response) {
                deferred.resolve(response.data);
            });

            return deferred.promise;
        }

        function getTransportadoras() {
            var deferred = $q.defer();
            ApiService.get('/v1/transportadora').then(function (response) {
                deferred.resolve(response.data);
            });

            return deferred.promise;
        }

        function getCfop() {
            var deferred = $q.defer();
            ApiService.get('/v1/cfop/all').then(function (response) {
                deferred.resolve(response.data);
            });

            return deferred.promise;
        }

        function getCnae() {
            var deferred = $q.defer();
            ApiService.get('/v1/cnae/all').then(function (response) {
                deferred.resolve(response.data);
            });

            return deferred.promise;
        }

        function getTags() {
            var deferred = $q.defer();
            ApiService.get('/v1/cadastro/tags').then(function (response) {
                deferred.resolve(response.data);
            });

            return deferred.promise;
        }

        function getHistoricoProduto(id) {
            var deferred = $q.defer();
            ApiService.get('/v1/produto/get/' + id + '/historico').then(function (response) {
                deferred.resolve(response.data);
            });

            return deferred.promise;
        }

        function getResumoAcabados() {
            var deferred = $q.defer();
            ApiService.get('/v1/produto/resumo-acabados').then(function (response) {
                deferred.resolve(response.data);
            });

            return deferred.promise;
        }

        function agendarDevolucao(form) {
            var deferred = $q.defer();
            ApiService.post('/v1/contrato/agendarDevolucao', form).then(function (response) {
                deferred.resolve(response.data);
            });

            return deferred.promise;
        }

        function exportData(tableId) {
            var blob = new Blob([document.getElementById(tableId).innerHTML], {
                type: 'text/plain;charset=utf-8;',
            });
            saveAs(blob, 'relatorio.xls');
        }

    }
})();
