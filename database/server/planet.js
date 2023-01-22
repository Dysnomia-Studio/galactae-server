module.exports = {
	findbyAddress: async(addr) => {
		try {
			return (await serverClient.query('SELECT * FROM planets WHERE address = $1 LIMIT 1', [addr])).rows[0];
		} catch(err) {
			log(err, 'error');
		}
	},
	findByOwner: async(userId) => {
		try {
			return (await serverClient.query('SELECT * FROM planets WHERE owner = $1', [userId])).rows;
		} catch(err) {
			log(err, 'error');
		}
	},
	update: async(inputPlanet) => {
		const planet = Object.assign({}, inputPlanet);
		const id = planet.id;
		delete planet.id;

		let [query, values] = db.buildUpdateQuery('planets', planet);
		values.push(id);
		query += ' WHERE id = $' + values.length;

		try {
			await serverClient.query(query, values);

			return true;
		} catch(err) {
			log(err, 'error');

			return false;
		}
	},
	findBySystemWithOwners: async(systemAddr) => {
		let planetList;
		try {
			planetList =  (await serverClient.query('SELECT * FROM planets WHERE address LIKE $1', [systemAddr + '%'])).rows;
		} catch(err) {
			log(err, 'error');
			planetList = [];
		}

		for(let i=0; i<planetList.length; i++) {
			const user = await db.player.find(planetList[i].owner);

			planetList[i].ownerName = null;
			planetList[i].ally = '';

			if(isset(user, 'object') && !user.name.includes('Colonisable')) {
				planetList[i].ownerName = user.name;
				if(user.ally) {
					const ally = await db.alliance.find(user.ally);

					if(ally && ally.name) {
						planetList[i].ally = ally.name;
					}
				}
			}
		}

		return planetList;
	},
	setOwner: async(planet, owner) => {
		try {
			await serverClient.query('UPDATE planets SET "lastResourcesUpdate" = NOW(), "lastUnitUpdate" = NOW() WHERE address = $1 AND ("owner" = \'00000000-0000-0000-0000-000000000001\' OR "owner" = \'00000000-0000-0000-0000-000000000002\')', [planet]);
			await serverClient.query('UPDATE planets SET owner = $1, "currResearch" = \'\' WHERE address = $2', [owner, planet]);
		} catch(err) {
			log(err, 'error');
		}
	},
	assignNewPlanet: async(plyId) => {
		try {
			await serverClient.query('BEGIN');

			const planetAddress = (await serverClient.query('SELECT * FROM planets WHERE "owner" = \'00000000-0000-0000-0000-000000000001\' LIMIT 1')).rows[0].address;

			await serverClient.query('UPDATE planets SET "lastResourcesUpdate" = NOW(), "lastUnitUpdate" = NOW(), owner = $1 WHERE address = $2', [plyId, planetAddress]);

			await serverClient.query('COMMIT');

			return planetAddress;
		} catch(err) {
			log(err, 'error');
			await serverClient.query('ROLLBACK');
		}
	},
	getInfluenceZones: async(plyId) => {
		try {
			const systems = {};

			const userData = await db.player.find(plyId);

			systems.playerSystems = Array.from(
				new Set(
					userData.planetlist
						.map(GameMap.getSystemFromAdress)
				)
			);

			systems.alliedSystems = [];
			systems.allyAlliedSystems = [];
			systems.ennemiesSystems = [];

			if(userData.ally !== null) {
				// Current alliance
				systems.alliedSystems = Array.from(
					new Set(
						await db.alliance.getMembersSystems(userData.ally)
					)
				);

				// Allied & Ennemies alliances
				const allyAllied = await db.alliance.getPacts(userData.ally);
				for(const allied of allyAllied) {
					let allyId = allied.first;
					if(allied.first === userData.ally) {
						allyId = allied.second;
					}

					if(allied.allied) {
						systems.allyAlliedSystems = Array.from(
							new Set([
								...(await db.alliance.getMembersSystems(allyId)),
								...systems.allyAlliedSystems
							])
						);
					} else {
						systems.ennemiesSystems = Array.from(
							new Set([
								...(await db.alliance.getMembersSystems(allyId)),
								...systems.ennemiesSystems
							])
						);
					}
				}
			}

			// alliedSystems / playerSystems filter
			systems.alliedSystems = systems.alliedSystems.filter((elt) => !systems.playerSystems.includes(elt));

			// alliedAndEnnemiesSystems
			systems.alliedAndEnnemiesSystems = systems.ennemiesSystems.filter((elt) => systems.alliedSystems.includes(elt) || systems.allyAlliedSystems.includes(elt));
			systems.allyAlliedSystems = systems.allyAlliedSystems.filter((elt) => !systems.alliedAndEnnemiesSystems.includes(elt));
			systems.ennemiesSystems = systems.ennemiesSystems.filter((elt) => !systems.alliedAndEnnemiesSystems.includes(elt));

			return systems;
		} catch(err) {
			log(err, 'error');
		}
	}
};
