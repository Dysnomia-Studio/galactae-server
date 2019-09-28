/**
 * Libs
 */
const assert = require('assert');

/**
 * My libs
 */
global.Websocket = require('../socket');

describe('• Websocket', () => {
	describe('# init()', () => {
		it('init() should define events', () => {
			console.log(Websocket);
			console.log(io.toString());
			console.log(JSON.stringify(io));
			console.log(Websocket.init);

			Websocket.init();

			assert(isset(socketEvents['game-connect']), true);
			assert(isset(socketEvents['game-disconnect']), true);
			assert(isset(socketEvents['disconnect']), true);
			assert(isset(socketEvents['chat-send']), true);
			assert(isset(socketEvents['planet-ask-data']), true);
			assert(isset(socketEvents['system-ask-mapData']), true);
			assert(isset(socketEvents['planet-build']), true);
			assert(isset(socketEvents['planet-rename']), true);

			assert(isset(socketEvents['research-change']), true);
			assert(isset(socketEvents['research-sync']), true);

			assert(isset(socketEvents['unit-type-create']), true);
			assert(isset(socketEvents['unit-type-rename']), true);
			assert(isset(socketEvents['unit-type-delete']), true);
			assert(isset(socketEvents['unit-build']), true);
			assert(isset(socketEvents['unit-ask-data']), true);

			assert(isset(socketEvents['fleet-set-priority']), true);
			assert(isset(socketEvents['fleet-move']), true);
			assert(isset(socketEvents['fleet-rename']), true);
			assert(isset(socketEvents['fleet-merge']), true);
			assert(isset(socketEvents['fleet-units-transfer']), true);
			assert(isset(socketEvents['fleet-transferFuel']), true);

			assert(isset(socketEvents['tactics-upsert']), true);
			assert(isset(socketEvents['tactics-delete']), true);
			assert(isset(socketEvents['fleet-tactics-assign']), true);

			assert(isset(socketEvents['daily-bonus']), true);

			assert(isset(socketEvents['tutorial-confirm']), true);

			assert(isset(socketEvents['server-monitore-connect']), true);
			assert(isset(socketEvents['admin-request-cmd']), true);
		});
	});
});