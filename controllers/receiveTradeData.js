//External Dependencies
const { Worker, isMainThread, workerData, MessageChannel } = require('worker_threads')
const log4js = require('log4js');
const path = require('path');
const fs = require('fs');
const readline = require('readline');

const { port1, port2 } = new MessageChannel();

//Internal dependencies
const config = require("../config/config.js");
const envConfig = config.environmentConfig();

const logger = log4js.getLogger('[receiveTradeData]');
logger.setLevel(envConfig.logLevel);

function ReadLine() {
    // Creating a readable stream from file
    // readline module reads line by line
    // but from a readable stream only.
    const file = readline.createInterface({
        input: fs.createReadStream(path.join(__dirname, envConfig.tradeData)),
        output: process.stdout,
        terminal: false
    });

    // Printing the content of file line by
    // line to console by listening on the
    // line event which will triggered
    // whenever a new line is read from
    // the stream
    file.on('line', (line) => {
        port1.postMessage(JSON.parse(line));
    });

    file.on('close', (line) => {
        port1.postMessage("END");
    })
}
ReadLine();

module.exports.port2 = port2;
