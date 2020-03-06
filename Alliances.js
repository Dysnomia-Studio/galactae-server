module.exports = class Alliances {
	static async sendToPlayer(player) {
		const ally = {
			id: player.ally.id,
			name: player.ally.name,
			description: player.ally.description,
			members: (await db.alliance.getMembers(player.ally.id)),
		};

		io.to(player.sid).emit('player-alliance-data', ally);
	}

	static async search(sid, searchText) {
		const alliances = await db.alliance.search(searchText);

		io.to(sid).emit('player-search-results', alliances);
	}

	static async create(sid, userData, name, description) {
		const allyId = await db.alliance.create({
			name,
			description,
		});

		await db.player.joinAlly(
			userData.id,
			allyId
		);

		log(userData.name + ' has created an new alliance named "' + name + '".');

		Alliances.sendToPlayer(userData);
	}
};
