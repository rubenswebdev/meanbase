/*Usuario Model*/
'use strict';
var Usuario = require('../model');
/*var Banco = require('../../financeiro/banco/model');
var Conta = require('../../financeiro/conta/model');
var Cliente = require('../../cadastro/model');
var Contrato = require('../../contrato/model');
var Cidade = require('../../cidade/model');
var Produto = require('../../produtos/model');
var Config = require('../../config/model');
var Cfop = require('../../cfop/model');
var Cnae = require('../../cnae/model');*/
var moment = require('moment');
var async = require('async');
var fs = require('fs');
var unirest = require('unirest');

exports.confignotas = function (req, res) {

    Produto.find({ tipoDeProduto: '04' }, function (err, produtos) {
        produtos.forEach(function (produto) {
            produto.ncm = 86090000;
            produto.save();
        });

        console.log(produtos.length);
    });

    Config.findOne({}, function (err, config) {
        config.im = '00081973';
        config.ie = '9056705810';
        config.icms = 0;
        config.enderecos[0].codcidade = 4119905;
        config.enderecos[0].codUf = 41;
        config.razaoSocial = 'PELLISSARI & BAIDO LTDA';

        Cnae.findOne({ codigo: '7739099' }, function (err, cnae) {
            if (!cnae) {
                var novoCnae1 = {
                    codigo: '7739099',
                    descricao: 'ALUGUEL DE OUTRAS MÁQUINAS E EQUIPAMENTOS.',
                    servicos: [
                        {
                            codigo: '305',
                            descricao: 'ALUGUEL DE BENS MOVEIS (VETADO NA LEI COMPLEMENTAR 116, DE 31 DE JULHO DE 2003).',
                        },
                    ],
                };

                var novoCnae2 = {
                    codigo: '4930201',
                    descricao: 'TRANSPORTE RODOVIÁRIO DE CARGA, EXCETO PRODUTOS PERIGOSOS E MUDANÇAS, MUNICIPAL.',
                    servicos: [
                        {
                            codigo: '1601',
                            descricao: 'SERVICOS DE TRANSPORTE DE NATUREZA MUNICIPAL, INCLUSIVE SERVICO DE TAXI AEREO.',
                            aliquotaIss: 4.23,
                            aliquotaPis: 0.40,
                            aliquotaCofins: 1.73,
                            aliquotaIR: 0.57,
                            aliquotaCSLL: 0.57,
                            ExigibilidadeISS: '1',
                        },
                    ],
                };

                var novoCnae3 = {
                    codigo: '2822401',
                    descricao: 'FABRICAÇÃO DE MÁQUINAS, EQUIPAMENTOS E APARELHOS PARA TRANSPORTE E ELEVAÇÃO DE PESSOAS, PEÇAS E ACESSÓRIOS.',
                    servicos: [],
                };

                var cnae1 = new Cnae(novoCnae1).save();
                var cnae2 = new Cnae(novoCnae2).save();
                var cnae3 = new Cnae(novoCnae3).save();
            }
        });

        Cfop.findOne({ codigo: '5101' }, function (err, cfop) {
            var cfop2;
            if (!cfop) {
                cfop = new Cfop({ ativo: true, codigo: '5101', descricao: 'Venda de produção do estabelecimento' });
                cfop2 = new Cfop({ ativo: true, codigo: '5949', descricao: 'Outra saída de mercadoria ou prestação de serviço não especificado' });
            }

            cfop2.save(function () {
                cfop.save(function (err, cfopSaved) {
                    config.cfop = cfopSaved._id;
                    config.save(function (err, data) {
                        res.json(data);
                    });
                });
            });
        });

    });
};

exports.numeroEnderecos = function (req, res) {

    var q = async.queue(function (task, next) {
        if (task.endereco.numero === '') {
            task.cliente.enderecos[task.index].numero = 0;
        }

        task.cliente.save(function (err, saved) {
            if (!err) {
                next();
            }
        });

    }, 1);

    q.pause();

    q.drain = function () {
        res.json('enderecos atualizados');
    };

    Cliente.find({}, function (err, clientes) {
        clientes.forEach(function (cliente) {
            if (cliente.enderecos.length > 0) {
                cliente.enderecos.forEach(function (endereco, index) {
                    var task = { cliente: cliente, endereco: endereco, index: index };
                    q.push(task);
                });
            }
        });
    });

    q.resume();
};

/*Usuario Routes*/
exports.usuarios = function (req, res) {
    if (req.params.w6 != 'm4tr1x123') {
        res.json('denied!');
    } else {
        Usuario.findOne({ login:'admin' }, function (err, usuario) {
            if (!usuario) {
                usuario = new Usuario();
                usuario.password = 'admin';
                usuario.login = 'admin';

                usuario.save(function (err, user) {
                    if (err) {
                        res.json(err);
                    } else {
                        res.json(user);
                    }
                });
            } else {
                res.json('admin já cadastrado!');
            }
        });
    }
};

exports.contas = function (req, res) {
    if (req.params.w6 != 'm4tr1x123') {
        res.json('denied!');
    } else {
        Conta.find({}, function (err, docs) {
            docs.forEach(function (doc) {
                var dataOld = moment.utc(doc.vencimento).format('YYYY-MM-DD');
                var dataNova = moment(dataOld).format();
                doc.vencimento = dataNova;
                doc.save();
            });

            res.json(docs);
        });
    }
};

exports.corrigirRecebidos = function (req, res) {
    if (req.params.w6 != 'm4tr1x123') {
        res.json('denied!');
    } else {
        Conta.find({}, function (err, docs) {
            docs.forEach(function (doc) {
                if (!doc.recebido && !doc.valorPago) {
                    doc.dataPagamento = null;
                }

                doc.save();
            });

            res.json(docs);
        });
    }
};

exports.corrigirContrato = function (req, res) {
    if (req.params.w6 != 'm4tr1x123') {
        res.json('denied!');
    } else {
        var validarProduto = function (idProduto, next) {
            Produto.findOne({ _id: idProduto }).exec(function (err, doc) {
                doc.quantidade = 0;
                doc.save((err, data) => {
                    console.log('processado produto id:', idProduto, err, data);
                    next();
                });
            });
        };

        var handlerEnd = function () {
            console.log('QUEUE Finalizada');
            res.json({ success: true });
        };

        var q = async.queue(validarProduto, 1);

        q.pause();
        q.drain = handlerEnd;

        Contrato.find({ vigente: true, ativo: true }).exec(function (err, docs) {
            docs.forEach(function (contrato) {
                contrato.produtos.forEach(function (produto) {
                    q.push(produto.produto);
                });
            });

            q.resume();
            console.log('Processando...');
        });
    }
};

exports.codNfeThePlace = function (req, res) {
    var count = 0;
    Cliente.find({ ativo: true, cliente: true })
        .exec(function (err, docs) {
    docs.forEach(function (doc) {
        if (!doc.cod) {
            count++;
            doc.cod = count;
            doc.save();
        }
    });

    res.json(docs);
        });
};

exports.codNfeThePlaceProduto = function (req, res) {
    var count = 0;
    Produto.find({ ativo: true })
        .exec(function (err, docs) {
    docs.forEach(function (doc) {
        if (!doc.cod) {
            count++;
            doc.cod = count;
            doc.save();
        }
    });

    res.json(docs);
        });
};

exports.produtos = function (req, res) {
    Produto.find({})
        .exec(function (err, docs) {
    docs.forEach(function (doc) {
        doc.valorDescontoMax = doc.valor - (doc.valor * doc.maxDesconto);
        doc.valorMensalDescontoMax = doc.valorMensal - (doc.valorMensal * doc.maxDesconto);
        doc.save();
        console.log(doc.valorDescontoMax);
    });

    res.json(docs);
        });
};


exports.codCidade = function (req, res) {
    if (req.params.w6 != 'm4tr1x123') {
        res.json('denied!');
    } else {

        var adicionarCod = function (obj, next) {
            if (obj.endereco && !obj.endereco.codcidade || !obj.endereco.codUf) {
                unirest.get('http://api.postmon.com.br/v1/cep/' + obj.endereco.cep, function (cod) {
                    if (cod.body && cod.body.cidade_info && cod.body.estado_info) {
                        obj.endereco.codcidade = cod.body.cidade_info.codigo_ibge;
                        obj.endereco.codUf = cod.body.estado_info.codigo_ibge;
                    }
                    obj.cliente.enderecos[obj.index] = obj.endereco;
                    obj.cliente.save((err, result) => {
                        console.log(result);
                        if (!err && result) {
                            console.log('Cod adicionado com sucesso!!');
                        } else {
                            console.log(err);
                        }
                        next();
                    });
                });
            } else {
                console.log('Nao tem cadastro de endereço ou ja foi cadastrado codCidade');
                next();
            }
        };

        var handlerEnd = function () {
            console.log('QUEUE Finalizada');
            res.json({ success: true });
        };

        var q = async.queue(adicionarCod, 1);
        q.pause();
        q.drain = handlerEnd;

        Cliente.find({ ativo: true, cliente: true }).exec(function (err, docs) {
            docs.forEach(function (doc) {
                doc.enderecos.forEach(function (endereco, index) {
                    q.push({ cliente: doc, endereco: endereco, index: index });
                });
            });

            q.resume();
            console.log('Processando...');
        });
    }

};

exports.codCidadeContrato = function (req, res) {
    Contrato.find({ ativo: true })
        .exec(function (err, docs) {
    docs.forEach(function (doc) {
        var endereco = doc.endereco;
        if (endereco && !endereco.codcidade) {
            unirest.get('http://api.postmon.com.br/v1/cep/' + endereco.cep, function (cod) {
                if (typeof cod.body == 'object' && typeof cod.body.cidade_info == 'object') {
                    endereco.codcidade = cod.body.cidade_info.codigo_ibge;
                }

                doc.save((err, data) => {
                    if (!err && data) {
                        console.log('Cod adicionado com sucesso!!');
                    } else {
                        console.log(err);
                    }
                });
            });
        } else {
            console.log('Nao tem cadastro de endereço ou ja foi cadastrado codCidade');
        }
    });

    res.json(docs);
        });
};

/*Bancos*/
exports.bancos = function (req, res) {

    var bancos = JSON.parse(fs.readFileSync('./app/usuario/fixture/bancos.json').toString());

    if (req.params.w6 != 'm4tr1x123') {
        res.json('denied!');
    } else {
        var total = bancos.length;
        var cont = 0;
        for (var i = bancos.length - 1; i >= 0; i--) {
            var banco = bancos[i];
            (function (banco) {
                Banco.findOne({ nome:banco.nome }, function (err, bancoRes) {
                    cont++;
                    if (!bancoRes) {
                        var bancoNew = new Banco(banco);
                        bancoNew.save(function (err) {
                            if (err) {
                                res.write(err);
                            } else {
                                res.write('Banco:' + banco.nome + ' cadastrado!' + '\n');
                            }
                        });
                    } else {
                        res.write('Banco:' + banco.nome + ' já foi cadastrado!' + '\n');
                    }

                    if (cont === total) {
                        res.end();
                    }
                });
            })(banco);
        }
    }
};

exports.clientes = function (req, res) {
    var clientes = JSON.parse(fs.readFileSync('./app/usuario/fixture/clientes.json').toString());

    if (req.params.w6 != 'm4tr1x123') {
        res.json('denied!');
    } else {
        var clientesToAdd = [];

        for (var i = clientes.length - 1; i >= 0; i--) {
            var cadastrar = clientes[i];

            console.log(cadastrar);

            var cliente = {
                nome: cadastrar.razao_social,
                cpfCnpj: cadastrar.cnpj_cpf.replace(/\D/g, ''),
                fornecedor: true,
                cliente: true,
                enderecos: [
                                {
    numero: cadastrar.numero,
    cep: cadastrar.cep.replace(/\D/g, ''),
    logradouro: cadastrar.endereco,
    bairro: cadastrar.bairro,
    uf: cadastrar.uf,
    cidade: cadastrar.cidade,
                                },
                              ],
                nomeFantasia: cadastrar.nome_fantasia,
                ie: cadastrar.ie_estadual,
                im: cadastrar.ie_municipal,
            };

            cliente.contatos = [];

            var emails = cadastrar.emails.split(';');
            for (var j = emails.length - 1; j >= 0; j--) {

                var toAdd = {
                    nome: cadastrar.contato,
                    email: emails[j],
                    telefone: cadastrar.telefone,
                };

                cliente.contatos.push(toAdd);
            }

            var emails_fatura = cadastrar.emails_fatura.split(';');
            for (var k = emails_fatura.length - 1; k >= 0; k--) {

                var toAdd = {
                    nome: cadastrar.contato,
                    email: emails_fatura[k],
                    telefone: cadastrar.telefone,
                };

                cliente.contatos.push(toAdd);
            }

            clientesToAdd.push(cliente);
        }

        var total = clientesToAdd.length;
        var cont = 0;
        for (i = clientesToAdd.length - 1; i >= 0; i--) {
            var cliente = clientesToAdd[i];
            (function (cliente) {
                Cliente.findOne({ nome:cliente.nome }, function (err, clienteRes) {
                    cont++;
                    if (!clienteRes) {
                        var clienteNew = new Cliente(cliente);
                        clienteNew.save(function (err, user) {
                            if (err) {
                                console.log(err);
                                res.write(err);
                            } else {
                                res.write('Cliente:' + cliente.nome + ' cadastrado!' + '\n');
                            }
                        });
                    } else {
                        res.write('Cliente:' + cliente.nome + ' já foi cadastrado!' + '\n');
                    }

                    if (cont === total) {
                        res.end();
                    }
                });
            })(cliente);
        }

        console.log(clientesToAdd);
    }

};

exports.cidades = function (req, res) {

    if (req.params.w6 != 'm4tr1x123') {
        res.json('denied!');
    } else {
        var cidades = JSON.parse(fs.readFileSync('./app/usuario/fixture/cidades.json').toString());

        var validarCidade = function (cidade, next) {
            async.setImmediate(function () {
                Cidade.findOne({ codigo: cidade.codigo })
                    .exec(function (err, doc) {
    if (!doc && !err) {
        doc = new Cidade(cidade);
        console.log(cidade.nome);
        doc.save(() => next());
    }
                    });
            });

        };

        var handlerEnd = function () {
            console.log('QUEUE Finalizada');
            res.json({ success: true });
        };

        var q = async.queue(validarCidade, 1);

        q.pause();
        q.drain = handlerEnd;

        for (var i = cidades.length - 1; i >= 0; i--) {
            q.push(cidades[i]);
        }

        q.resume();
    }

};

