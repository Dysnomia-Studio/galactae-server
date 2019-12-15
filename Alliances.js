module.exports = class Alliances {
	static sendToPlayer(player) {
		const ally = {
			name: player.ally.name,
			description: player.ally.description,
		};

		io.to(player.sid).emit('player-alliance-data', ally);
	}
};
