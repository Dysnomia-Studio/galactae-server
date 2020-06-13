module.exports = class GameMap extends require('./_shared/GameMap')._GameMap {
	static async syncPlayer(plyId, sid) {
		if(sid === null || sid === '-1') {
			return;
		}

		io.to(sid).emit(
			'map-influence-zones',
			await db.planet.getInfluenceZones(plyId)
		);
	}
};

