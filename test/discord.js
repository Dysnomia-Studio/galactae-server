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