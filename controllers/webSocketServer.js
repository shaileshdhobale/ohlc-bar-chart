const WebSocket = require('ws');
const log4js = require('log4js');
const { Worker, MessageChannel, workerData, receiveMessageOnPort } = require('worker_threads')
const _ = require('lodash');
const path = require('path');

// Internal dependencies
const config = require("../config/config.js");
const envConfig = config.environmentConfig();

let fsm = require('./fsm').fsm
const logger = log4js.getLogger('[webSocketServer]');
logger.setLevel(envConfig.logLevel);


const wss = new WebSocket.Server({
    port: 9000,
    path: '/subscribe',
    perMessageDeflate: {
      zlibDeflateOptions: {
        // See zlib defaults.
        chunkSize: 1024,
        memLevel: 7,
        level: 3
      },
      zlibInflateOptions: {
        chunkSize: 10 * 1024
      },
      // Other options settable:
      clientNoContextTakeover: true, // Defaults to negotiated value.
      serverNoContextTakeover: true, // Defaults to negotiated value.
      serverMaxWindowBits: 10, // Defaults to negotiated value.
      // Below options specified as default values.
      concurrencyLimit: 1, // Limits zlib concurrency for perf.
      threshold: 1024 // Size (in bytes) below which messages
      // should not be compressed.
    }
  });


  wss.on('connection', function connection(ws) {
      global.webSocket = ws;
      // logger.info('ws', global.webSocket);
      logger.info('Webscoket server started on port: 8080');
    ws.on('message', function incoming(msg) {
      const tradeEvent = JSON.parse(msg);
     
      if(_.get(tradeEvent, 'event') === 'subscribe') {
        logger.info('Message received from client: %s', tradeEvent);
        new Worker(path.join(__dirname, envConfig.worker2), {workerData: _.get(tradeEvent, 'symbol')})
        fsm.initializeRetriveDateWorker();
       
      } else {
        logger.info('Unknown message format received from client %O', JSON.stringify(tradeEvent));
      }
    });
    ws.send('Client sucessfully subscribed...');
  });