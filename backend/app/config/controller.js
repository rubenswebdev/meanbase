/*Produto Model*/
var Model = require('./model');
var config = require('../../config');
/*Produtos Routes*/
exports.index = function(req, res) {
	Model.findOne({})
		.exec(function(err, data){ //o que fazer com o resultado
				res.json({"success": true, "data": data, "err" : err, "form" : req.body});
		});
}

exports.cfop = function(req, res) {
	Model.findOne({})
		.deepPopulate('cfop')
		.exec(function(err, data){ //o que fazer com o resultado
				res.json({"success": true, "data": data, "err" : err, "form" : req.body});
		});
}

exports.new = function(req, res) {
	var form = JSON.parse(req.body.data);
	Model.findOne({}, function(err, model){

		if (!model) {
			var model = new Model(form);
		} else {
			model.nome = form.nome;
			model.razaoSocial = form.razaoSocial;
			model.cpfCnpj = form.cpfCnpj;
			model.numeroContrato = form.numeroContrato;
			model.numeroOrcamento = form.numeroOrcamento;
			model.numeroNFE = form.numeroNFE;
			model.kmRodado = form.kmRodado;
			model.cargaDescarga = form.cargaDescarga;
			model.site = form.site;
			model.im = form.im;
			model.ie = form.ie;
		 	model.enderecos = form.enderecos;
			model.contatos = form.contatos;
		  	model.responsavelNome = form.responsavelNome;
		  	model.responsavelEmail = form.responsavelEmail;
		  	model.prefeitura = form.prefeitura;
		  	model.icms = form.icms;
		  	model.cfop = form.cfop;
		  	model.valorPis =form.valorPis;
		  	model.valorCofins = form.valorCofins;
		  	model.valorInss = form.valorInss;
		  	model.valorIr = form.valorIr;
		  	model.valorCsll = form.valorCsll;
		  	model.issRetido = form.issRetido;
		  	model.exigibilidadeISS = form.exigibilidadeISS;
		  	model.codigoCnae = form.codigoCnae;
		  	model.serie = form.serie;
		  	model.status = form.status;
		  	model.IdentificacaoRpsTipo = form.IdentificacaoRpsTipo;
		}

		if (req.files.file) {
			var foto = req.files.file.path;
			model.logo = foto.replace(config.uploadPath, '');
		}

		delete req.files; // nao esquecer se nao deletar da treta para outras rotas de upload

		model.save(function (err, data) {
			//err null quando ta tudo certo, data traz o model inserido,
		  	if (!err && data) {
		  		//form apenas para debugar
				res.json({"success": true, "data": data, "err" : err, "form" : form});
			} else {
				res.json({"success": false, "data": data, "err" : err, "form" : form});
			}
		});

	});
}