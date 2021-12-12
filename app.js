process.on('uncaughtException', function (exception) {
	console.log(exception);
});

process.on('unhandledRejection', (reason, p) => {
	console.log('Unhandled Rejection at: Promise ', p, ' reason: ', reason);
});

import globalCfg from './config.js';

import ClientSocket from './client-socket/index.js';

import Logger from '@dysnomia/logger';

const logger = new Logger();

(new ClientSocket(logger, globalCfg.serverPort));