var express = require('express');
var route = express.Router();
/*arquivo com as funcoes da rota*/
var fixture = require('./fixture.controller');


/*Rotas*/
/*get all*/
route.get('/:w6?', fixture.usuarios);
//route.get('/bancos/:w6?', fixture.bancos);
//route.get('/clientes/:w6?', fixture.clientes);
//route.get('/cidades/:w6?', fixture.cidades);

//route.get('/contas/:w6?', fixture.contas); //corrige as datas das contas
//route.get('/corrigirRecebidos/:w6?', fixture.corrigirRecebidos); //corrige as datas das contas
//route.get('/produtos/:w6?', fixture.produtos); //corrige valor desconto max dos produtos
//route.get('/cod-cidade/:w6?', fixture.codCidade); //coloca o codigo do ibge nas cidades em cliente

//fixture que devem ser rodadas por causa da nfe para ajustar dados
//route.get('/cod-cidade-contrato/:w6?', fixture.codCidadeContrato); //coloca o codigo do ibge nas cidades em cliente
//route.get('/corrigir-contrato/:w6?', fixture.corrigirContrato); //corrige valor desconto max dos produtos
//route.get('/cod-nfe/:w6?', fixture.codNfeThePlace); //adicionar um cod em contratos ja cadastrado pra gerar faturamento
//route.get('/cod-produto/:w6?', fixture.codNfeThePlaceProduto); //adicionar um cod em contratos ja cadastrado pra gerar faturamento
//route.get('/numero-enderecos/:w6?', fixture.numeroEnderecos); //adicionar um cod em contratos ja cadastrado pra gerar faturamento


//route.get('/config-notas/:w6?', fixture.confignotas); //adicionar um cod em contratos ja cadastrado pra gerar faturamento

/*Export*/
module.exports = route;
