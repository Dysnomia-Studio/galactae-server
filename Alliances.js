module.exports = class Alliances {
	static async sendToPlayer(player) {
		const ally = {
			name: player.ally.name,
			description: player.ally.description,
			members: (await db.player.findByAlly(player.ally.id)).map((ply) => ply.name)
		};

		io.to(player.sid).emit('player-alliance-data', ally);
	}
};
