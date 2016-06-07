var mongoose = require('mongoose');

var Schema = mongoose.Schema({
  ativo: {
  	type: Boolean,
  	default: true
  },
  nome: String
});

module.exports = mongoose.model('Relatorios', Schema);