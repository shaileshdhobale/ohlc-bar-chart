// var cron = require('node-cron');
const log4js = require('log4js');
const _ = require('lodash');
const path = require('path');
const { Worker, workerData, MessageChannel } = require('worker_threads')
const events = require('events');


//Internal dependencies
const config = require("../config/config.js");
const envConfig = config.environmentConfig();

const logger = log4js.getLogger('[fsm]');
logger.setLevel(envConfig.logLevel);

// const ws = workerData.ws;
// const workerData = workerData.workerData;
// logger.info(sendMsg);
const receivedTrade = require('./receiveTradeData').port2;
const eventEmitter = new events.EventEmitter();

const ohlcData = {};
let symbolData = {}

let worker1;

function initializeRetriveDateWorker() {
    logger.info("Creating readTradeData thread...");
    if(!worker1) worker1 = new Worker(path.join(__dirname, envConfig.worker1), {workerData: workerData});
};


function evaluateOHLCEvent(td) {
    if(ohlcData[workerData] && ohlcData[workerData].length > 0 || (ohlcData[workerData] && ohlcData[workerData].length > 0 && td === 'END') ) {
        const { P: max } = _.maxBy(ohlcData[workerData], function(o) { return o.P });
        const { P: min } = _.minBy(ohlcData[workerData], function(o) { return o.P });
        const sum = _.sumBy(ohlcData[workerData], function(o) { return o.Q });
        const length = ohlcData[workerData].length;
        const msg = {
            o: ohlcData[workerData][0].P,
            h: max,
            l: min,
            c: ohlcData[workerData][length -1].P,
            volume: sum / length,
            event:'ohlc_notify',
            symbol: workerData,
            bar_num:symbolData[workerData].bar_num,
            period: new Date(symbolData[workerData].TS)
        }
        ohlcData[workerData] = [];
        logger.info('Sending ohlc data to client: ', msg);
        
    } else if(workerData === _.get(td, 'sym')) {
        const msg = {
            event:'ohlc_notify',
            symbol: workerData,
            bar_num:symbolData[workerData].bar_num,
            period: new Date(symbolData[workerData].TS),
        }
        if (workerData) logger.info('Sending ohlc data to client: ', msg);
    }
}

receivedTrade.on('message', (td) => {
    if(!symbolData[workerData] && workerData === td.sym) {
        symbolData[workerData] = {};
        symbolData[workerData].TS = (td.TS2 / 1e6) ;
        symbolData[workerData].bar_num = 1;
    }
    if (workerData === td.sym && ((td.TS2 / 1e6) <= symbolData[workerData].TS)) {
        ohlcData[workerData] = [];
        ohlcData[workerData].push(td);
    } else if(workerData === td.sym && (_.get(td, 'TS2') / 1e6) > symbolData[workerData].TS) {
        evaluateOHLCEvent(td);
        symbolData[workerData].TS = _.get(td, 'TS2') / 1e6 + 15;
        symbolData[workerData].bar_num = symbolData[workerData].bar_num + 1;
    } else if(td === 'END') {
        evaluateOHLCEvent(td);
    }
});

receivedTrade.on('close', () => logger.info('closed!'));

module.exports.fsm = {
    initializeRetriveDateWorker
};
