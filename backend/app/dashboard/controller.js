/*Produto Model*/
var Model = require('./model');
/*var Cadastro = require('../cadastro/model');
var Produto = require('../produtos/model');
var Contrato = require('../contrato/model');
var Orcamento = require('../orcamento/model');
var ProdutoCustom = require('../produtoCustom/model');
var PropostaVenda = require('../propostaVenda/model');
var Vendas = require('../venda/model');*/
var config = require('../../config');
var moment = require('moment');
/*relatorios Routes*/
exports.getNumerosRelatorio = function(req, res) {
	var query = {cliente: true, ativo: true};

	Cadastro.find(query).count()
		.exec(callback);

	function callback(err, data){
		var response = {};
		//resultado do count de Cliente
		response.cliente = data;

		var collection = {lead: true, ativo: true};
		Cadastro.find(collection).count()
			.exec(function(err, lead){
				//resultado do count de clientes leads ou prospectos
				response.prospecto = lead;

				var produto = {tipoDeProduto : "04", ativo: true};
				Produto.find(produto).count()
					.exec(function(err, numProdutos){
						//resultado do count de produtos acabados
						response.produtoAcabado = numProdutos;

							//começo query de contratos ativos
							Produto.find({locacao: true, tipoDeProduto: "04"})
								.deepPopulate('contrato')
								.exec(function(err, docs){
									var dados = 0;
									for (var i = docs.length - 1; i >= 0; i--) {
										var doc = docs[i];
										if (doc.contrato && doc.contrato.vigente && doc.contrato.ativo) {
											dados++;
										}
									}
									//Resultado de contratos ativos
									response.contratoAtivo = dados;

									//começo query de orçamento
									var numOrcamento = {};
									numOrcamento.ativo = true;
									numOrcamento.data = {};
									numOrcamento.data.$gte = moment().format();
									//fim query de orçamento

									Orcamento.find(numOrcamento).count()
										.exec(function(err, orcamento){
											var orcamento = orcamento;

											//começo query de contratos ativos
											var numProdutoCustom = {};
											numProdutoCustom.ativo = true;
											//fim query de contratos ativos

											ProdutoCustom.find(numProdutoCustom).count()
												.exec(function(err,produtoCustom){
													var prodCustom = produtoCustom + orcamento;

													//começo query de proposta de vendas
													var numVendas = {};
													numVendas.ativo = true;
													//fim query de proposta de vendas

													PropostaVenda.find(numVendas).count()
														.exec(function(err, propostaVendas){
															//Resultado de propostas
															response.propostas = prodCustom + propostaVendas;

															//começo query de vendas
															var pedidoVendas = {};
															pedidoVendas.ativo = true;
															//fim query de vendas

															Vendas.find(pedidoVendas).count()
																.exec(function(err, vendas){
																	response.vendas = vendas;
																	res.json(response);
																});

														});
												});


										});


								});
					});
			});
	}
}


exports.inativos = function(req, res) {
	var texto = req.params.text;

	var filtro = {};
	filtro.ativo = false;

	if (texto) {
		texto = decodeURI(texto);
		filtro.$or = [];
		filtro.$or.push({nome: {$regex: texto, $options: 'ig'} });
	}

	Model.find(filtro)
		.skip(parseInt(req.params.skip) || 0).limit(parseInt(req.params.limit) || 25)
		.exec(function(err, data){ //o que fazer com o resultado

				Model.find(filtro).count()
				.exec(function(err, total){
					var response = {};
					response.total = total;
					response.data = data;
					res.json(response);
				});

		});
}

exports.all = function(req, res) {
	var  filtro = {};
	filtro.ativo = true;

	Model.find(filtro)
		.exec(function(err, data){ //o que fazer com o resultado

				Model.find(filtro).count()
				.exec(function(err, total){
					var response = {};
					response.total = total;
					response.data = data;
					res.json(response);
				});

		});
}


exports.get = function(req, res) {
	Model.findOne(
			{_id: req.params.id},// Where
			function(err, data){ // o que fazer com o resultado
				res.json(data);
			}
	);
}

exports.new = function(req, res) {
	var model = new Model(req.body);
	model.save(function (err, data) {
		//err null quando ta tudo certo, data traz o model inserido,
	  	if (!err && data) {
	  		//form apenas para debugar
			res.json({"success": true, "data": data, "err" : err, "form" : req.body});
		} else {
			res.json({"success": false, "data": data, "err" : err, "form" : req.body});
		}
	});
}

exports.delete = function(req, res) {
	Model.remove({_id: req.params.id},function(err, data) {
		res.json(data);
	})
}

exports.edit = function(req, res) {
	Model.update(
		{_id: req.body._id}, //where
		req.body,//options
		function (err, data){
			if (!err && data) {
				res.json({"success": true, "data": data, "err" : err, "form" : req.body});
			} else {
				res.json({"success": false, "data": data, "err" : err, "form" : req.body});
			}
		}
	);
}
