module.exports = {
	getActiveConquestsByPlayer: async(plyId) => {
		try {
			return (await serverClient.query(
				'SELECT prev_player.name as prevPlayer, new_player.name as newPlayer, conquest.planet, conquest."endDate" FROM public."conquest" INNER JOIN users AS prev_player ON prev_player.id = "prevOwner" INNER JOIN users AS new_player ON new_player.id = "newOwner" WHERE ("prevOwner" = $1 OR "newOwner" = $1) AND "endDate" < $2 AND done = false AND aborted = false',
				[plyId, new Date()]
			)).rows;
		} catch(err) {
			log(err, 'error');
		}
	},

	setDone: async(planet) => {
		try {
			return (await serverClient.query(
				'UPDATE conquest SET done = true WHERE planet = $1 AND done = false AND aborted = false',
				[planet]
			)).rows;
		} catch(err) {
			log(err, 'error');
		}
	},

	getConquestsByPlayer: async(plyId) => {
		try {
			return (await serverClient.query(
				'SELECT prev_player.name as prevPlayer, new_player.name as newPlayer, conquest.planet, conquest."endDate" FROM public."conquest" INNER JOIN users AS prev_player ON prev_player.id = "prevOwner" INNER JOIN users AS new_player ON new_player.id = "newOwner" WHERE ("prevOwner" = $1 OR "newOwner" = $1) AND done = false AND aborted = false',
				[plyId]
			)).rows;
		} catch(err) {
			log(err, 'error');
		}
	},

	getActiveConquestsOnPlanet: async(address, date = new Date()) => {
		try {
			return (await serverClient.query(
				'SELECT * FROM public."conquest" WHERE "planet" = $1 AND "endDate" > $2 AND aborted = false',
				[address, date]
			)).rows;
		} catch(err) {
			log(err, 'error');
		}
	},

	beginConquest: async(planet, prevOwner, newOwner, battleDate) => {
		try {
			await serverClient.query('BEGIN');

			const endDate = new Date(battleDate);
			endDate.setDate(endDate.getDate() + 1); // @TODO: use config to determine speed

			// Get latest end of conquest on this planet
			const conquestsList = await db.conquest.getActiveConquestsOnPlanet(planet);

			let conquestReportTime = TIME.DAY_TO_MS; // @TODO: use config to determine speed
			let lastConquest = endDate.getTime();

			for(const conquest of conquestsList) {
				if(lastConquest < conquest.endDate.getTime()) {
					lastConquest = conquest.getTime();
					conquestReportTime = endDate.getTime() - conquest.endDate.getTime();
				}
			}

			// Report times on planet
			const planetData = await db.planet.findbyAddress(planet);
			const updatedPlanet = {
				address: planetData.address,
				nextBuildingTime: new Date((new Date(planetData.nextBuildingTime)).getTime() + conquestReportTime),
				unitBuildingEndTime: new Date((new Date(planetData.unitBuildingEndTime)).getTime() + conquestReportTime),
			};
			await db.planet.update(updatedPlanet);

			// Create conquest on database
			await serverClient.query(
				'INSERT INTO public."conquest" ("prevOwner", "newOwner", planet, "endDate") VALUES ($1, $2, $3, $4)',
				[prevOwner, newOwner, planet, endDate]
			);

			await serverClient.query('COMMIT');
		} catch(err) {
			log(err, 'error');
			await serverClient.query('ROLLBACK');
		}
	},

	abortAllMilitaryConquest: async(planet, beginDate) => {
		try {
			return (await serverClient.query(
				'UPDATE public."conquest" SET aborted = true WHERE "planet" = $1 AND "endDate" != $2',
				[planet, beginDate] // @TODO: filter by type
			)).rows;
		} catch(err) {
			log(err, 'error');
		}
	},
};
