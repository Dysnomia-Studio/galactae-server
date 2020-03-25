module.exports = class Conquest {
	static async syncPlayer(plyId, sid) {
		io.to(sid).emit(
			'player-conquest-list',
			await db.conquest.getConquestsByPlayer(plyId)
		);
	}
};
