/**
 * Libs
 */
const assert = require('assert');

/**
 * My libs
 */
global.Discord   = require('../discord');
let discordClient;

describe('• Discord', function() {
	before(function(done) {
		discordClient = Discord.connect();
		done();
	});

	after(function(done) {
		discordClient.destroy();
		done();
	});
});