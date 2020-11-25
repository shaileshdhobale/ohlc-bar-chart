const { Logger } = require('log4js/lib/logger');
// Extenal dependencies
const WebSocket = require('ws');
const log4js = require('log4js');

// Internal dependencies
const config = require("../config/config.js");
const envConfig = config.environmentConfig();
const logger = log4js.getLogger('[webSocketClient]');

logger.setLevel(envConfig.logLevel);

const ws = new WebSocket('ws://localhost:9000/subscribe');
 
ws.on('open', function open() {
  logger.info('Client subscribing with symbol...');
  ws.send('{"event": "subscribe", "symbol": "XXBTZUSD", "interval": 15}');
});
 
ws.on('message', function incoming(data) {
  logger.info('Data received from server: ', data);
});