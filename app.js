//external dependencies
var express = require('express');
var app = express();
var log4js = require('log4js');

//config
var config = require("./config/config.js");
var controller = require('./controllers/index');
var envConfig = config.environmentConfig();

//logger
log4js.configure('./config/logConfig.json');
var logger = log4js.getLogger('[app]');
logger.setLevel(envConfig.logLevel);

var server = app.listen(envConfig.port);
logger.info('Express server listening on port: ' + server.address().port);


controller.initilazeWorker();