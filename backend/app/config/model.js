var mongoose = require('mongoose');

var Schema = mongoose.Schema({
    nome: String,
    cpfCnpj: String,
    logo: String,
    im: String,
    status: { type: String, default: '1' },
    dataDeEmissao: {
        type: Date,
        default: Date.now,
    },
    enderecos: [
        {
        pais: String,
        cep: String,
        logradouro: String,
        bairro: String,
        uf: String,
        cidade: String,
        numero: String,
        complemento: String,
        codcidade: Number,
        selectedUF: String,
        codUf: Number,
    },
],
    ie: String,
    contatos: [
        {
        nome: String,
        email: String,
        telefone: String,
    },
],
    responsavelNome: String,
    razaoSocial: String,
    responsavelEmail: String,
});

var deepPopulate = require('mongoose-deep-populate')(mongoose);
Schema.plugin(deepPopulate,  {});

module.exports = mongoose.model('Config', Schema);
