var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var server = require('http').Server(app);
var path = require('path');
var cors = require('cors');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors());

app.get('/', function (req, res, next) {
    res.json('online');
});

var config = require('./config');
var mongoose = require('mongoose');
mongoose.connect(config.database);
/*Seed - rota para cadastrar o admin no banco*/
app.use('/fixture', require('./app/usuario/fixture'));

/*Login de Usuarios*/
app.use('/', require('./app/usuario/auth'));

/*Mid para rotas da API verificar JWT*/
var jwt = require('./core/jwt');
app.use('/v1', jwt);

/*Modulos*/
jwt.use('/usuario', require('./app/usuario'));
jwt.use('/dashboard', require('./app/dashboard'));
jwt.use('/config', require('./app/config'));

server.listen(config.port, '127.0.0.1');
console.log('Server start: ' + config.port);
