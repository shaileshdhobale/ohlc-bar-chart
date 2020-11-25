//External Dependencies
const { Worker, isMainThread, parentPort } = require('worker_threads')
const log4js = require('log4js');
const path = require('path');

//Internal dependencies
const config = require("../config/config.js");
const envConfig = config.environmentConfig();
console.log(envConfig, envConfig.worker1)
const logger = log4js.getLogger('[index]');
logger.setLevel(envConfig.logLevel);

module.exports.initilazeWorker = function () {
    if (isMainThread) {
        const webSocketThread = new Worker(path.join(__dirname, envConfig.worker3));
        webSocketThread.once('message', (message) => {
            logger.info(message);
        });
        webSocketThread.postMessage('WebSocket server started...');
    } else {
        // When a message from the parent thread is received, send it back:
        parentPort.once('message', (message) => {
            parentPort.postMessage(message);
        });
    }
}