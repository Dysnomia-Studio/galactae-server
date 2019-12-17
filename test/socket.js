describe('• Websocket', () => {
	describe('# init()', () => {
		it('init() should define events', () => {
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
			assert(isset(socketEvents['units-ask-data']), true);

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

			assert(isset(socketEvents['player-report-ask']), true);
			assert(isset(socketEvents['player-report-delete']), true);
			assert(isset(socketEvents['player-report-set-read']), true);
			assert(isset(socketEvents['player-report-set-unread']), true);

			assert(isset(socketEvents['server-monitore-connect']), true);
			assert(isset(socketEvents['admin-request-cmd']), true);
		});
	});

	describe('# SendMessageToClient', () => {
		it('SendMessageToClient(normal data)', () => {
			const payload = {
				sid: 'MyAmazingSid',
				message: 'Hello there',
			};

			io.to = (sid) => {
				return {
					emit: (event, data) => {
						assert.equal(sid, payload.sid);
						assert.equal(event, 'server-alert');
						assert.equal(data, payload.message);
					}
				};
			};

			Websocket.SendMessageToClient(payload);
		});
	});

	// Temp:
	Discord.alert = () => {};

	describe('# SendGeneralMessage', () => {
		it('SendGeneralMessage(normal data)', () => {
			const payload = 'Hello there';

			io.emit = (event, data) => {
				assert.equal(event, 'server-general-alert');
				assert.equal(data, payload);
			};

			Websocket.SendGeneralMessage(payload);
		});
	});

	describe('# sendNotification', () => {
		it('sendNotification(normal data)', () => {
			const sid = 'MyAmazingSid';

			const payload = {
				type: 'NotifType',
				args: 'NotifArgs',
			};

			io.to = (sid) => {
				return {
					emit: (event, data) => {
						assert.equal(sid, sid);
						assert.equal(event, 'notification');
						assert.deepEqual(data, payload);
					}
				};
			};

			Websocket.sendNotification(
				sid,
				payload.type,
				payload.args
			);
		});
	});

	describe('# sendTutorial', () => {
		it('sendTutorial(normal data)', () => {
			const user = {
				sid: 'MyAmazingSid'
			};

			const payload = {
				type: 'NotifType',
				args: 'NotifArgs',
			};

			io.to = (sid) => {
				return {
					emit: (event, data) => {
						assert.equal(sid, user.sid);
						assert.equal(event, 'tutorial');
						assert.deepEqual(data, payload);
					}
				};
			};

			Websocket.sendTutorial(
				user,
				payload
			);
		});
	});
});
