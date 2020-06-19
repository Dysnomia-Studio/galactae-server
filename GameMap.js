module.exports = class GameMap extends require('./_shared/GameMap')._GameMap {
	static async syncPlayer(plyId, sid) {
		if(sid === null || sid === '-1') {
			return;
		}

		console.log(sid);
		console.log(plyId);

		const influenceZones = await db.planet.getInfluenceZones(plyId);

		console.log(sid);
		console.log(plyId);

		io.to(sid).emit(
			'map-influence-zones',
			influenceZones
		);
	}
};

