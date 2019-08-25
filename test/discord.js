/**
 * Libs
 */
let assert = require('assert');

/**
 * My libs
 */
global.Discord   = require('../discord');
let discordClient;

describe('• Discord', () => {
	before((done) => {
		discordClient = Discord.connect();
		done();
	});

	after((done) => {
		discordClient.destroy();
		done();
	});
});