const dataModel = {
	message: '',
	send: true,
	sid: '',
};

describe('• Chat', () => {
	/**
	 * getPlanetCoords
	 */
	describe('# protect()', () => {
		it('Empty tests: protect("normal message")', () => {
			const inData = JSON.parse(JSON.stringify(dataModel));
			inData.message='normal message';

			const data = Chat.protect(inData);

			assert.equal(
				data.send,
				true
			);
		});
		it('Empty tests: protect(" ")', () => {
			let inData = JSON.parse(JSON.stringify(dataModel));
			inData.message=' ';

			let data = Chat.protect(inData);

			assert.equal(
				data.send,
				false
			);


			inData = JSON.parse(JSON.stringify(dataModel));
			inData.message='    ';

			data = Chat.protect(inData);

			assert.equal(
				data.send,
				false
			);
		});

		it('Empty tests: protect(" ")', () => {
			const inData = JSON.parse(JSON.stringify(dataModel));
			inData.message=undefined;

			const data = Chat.protect(inData);

			assert.equal(
				data.send,
				false
			);
		});

		it('Link tests: protect("without link")', () => {
			const inData = JSON.parse(JSON.stringify(dataModel));
			inData.message='normal message';

			const data = Chat.protect(inData);

			assert.equal(
				data.send,
				true
			);
		});
		it('Link tests: protect("with link (http:// ... )")', () => {
			const inData = JSON.parse(JSON.stringify(dataModel));
			inData.message='with link (http:// ... )';

			const data = Chat.protect(inData);

			assert.equal(
				data.send,
				false
			);
		});
		it('Link tests: protect("with link (www.blabla.com)")', () => {
			const inData = JSON.parse(JSON.stringify(dataModel));
			inData.message='with link (www.blabla.com)';

			const data = Chat.protect(inData);

			assert.equal(
				data.send,
				false
			);
		});
	});

	/**
	 * sendSM
	 */
	describe('# sendSM()', () => {
		it('should work', () => {
			io.to = (sid) => {
				return {
					emit: (event, content) => {
						if(event === 'chat-message-system') {
							assert.equal(content, 'message');
						}
					},
				};
			};

			Chat.sendSM('sid', 'message');
		});
	});

	/**
	 * sendPM
	 */
	describe('# sendPM()', () => {
		it('should work (with sound true)', () => {
			io.to = (sid) => {
				return {
					emit: (event, content) => {
						if(event === 'chat-message-private') {
							assert.deepEqual(content, {
								msg: 'message',
								sound: true,
							});
						}
					},
				};
			};

			Chat.sendPM('sid', 'message', true);
		});

		it('should work (with sound false)', () => {
			io.to = (sid) => {
				return {
					emit: (event, content) => {
						if(event === 'chat-message-private') {
							assert.deepEqual(content, {
								msg: 'message',
								sound: false,
							});
						}
					},
				};
			};

			Chat.sendPM('sid', 'message', false);
		});
	});
});