import { createServer } from 'http';
import { Server } from 'socket.io';

import log from '@dysnomia/logger';

export default class ClientSocket {
	#io = null;
	#logger = null;

	constructor(logger, port) {
		const server = createServer()
		server.listen(port);

		this.#io = new Server(server, {
			transports: ['websocket']
		});
		this.#logger = logger;

		this.setupEvents();

		this.#logger.log('Server ClientSocket is listening on *:' + port);
	}

	setupEvents() {
		this.#io.on('connection', function(socket) {

		});
	}
}