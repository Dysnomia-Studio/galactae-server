/**
 * Libs
 */
let assert = require('assert');

/**
 * My libs
 */
require('../calcConstants')();
require('../misc')();

global.Chat = require('../chat');
global.io = class { // Prevent bugs, it's temporary
	static to() { return new io(); }
	emit() { return 0; }
};

const dataModel = {
	message: "",
	send: true,
	sid: ""
};

describe('• Chat', function() {
	/**
	 * getPlanetCoords
	 */
	describe('# protect()', function() {
		it('Empty tests: protect("normal message")', function() {
			let inData = JSON.parse(JSON.stringify(dataModel));
			inData.message="normal message";

			let data = Chat.protect(inData);

			assert.equal(
				data.send,
				true
			);
		});
		it('Empty tests: protect(" ")', function() {
			let inData = JSON.parse(JSON.stringify(dataModel));
			inData.message=" ";
			
			let data = Chat.protect(inData);

			assert.equal(
				data.send,
				false
			);


			inData = JSON.parse(JSON.stringify(dataModel));
			inData.message="    ";
			

			data = Chat.protect(inData);

			assert.equal(
				data.send,
				false
			);
		});

		it('Link tests: protect("without link")', function() {
			let inData = JSON.parse(JSON.stringify(dataModel));
			inData.message="normal message";

			let data = Chat.protect(inData);

			assert.equal(
				data.send,
				true
			);
		});
		it('Link tests: protect("with link (http:// ... )")', function() {
			let inData = JSON.parse(JSON.stringify(dataModel));
			inData.message="with link (http:// ... )";

			let data = Chat.protect(inData);

			assert.equal(
				data.send,
				false
			);
		});
		it('Link tests: protect("with link (www.blabla.com)")', function() {
			let inData = JSON.parse(JSON.stringify(dataModel));
			inData.message="with link (www.blabla.com)";

			let data = Chat.protect(inData);

			assert.equal(
				data.send,
				false
			);
		});
	});
});