module.exports = class Alliances {
	static async sendToPlayer(player) {
		const ally = {
			name: player.ally.name,
			description: player.ally.description,
			members: (await db.player.findByAlly(player.ally.id)).map((ply) => ply.name)
		};

		io.to(player.sid).emit('player-alliance-data', ally);
	}

	static async search(sid, searchText) {
		const alliances = await db.alliances.search(searchText);

		io.to(sid).emit('player-search-results', alliances);
	}

	static async create(sid, userData, name, description) {
		const allyId = await db.alliances.create({
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
