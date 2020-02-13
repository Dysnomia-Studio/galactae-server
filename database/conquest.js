module.exports = {
	getActiveConquestsOnPlanet: async (address) => {
		try {
			return await serverClient.query(
				'SELECT * FROM public."conquest" WHERE "planet" = $1',
				[address]
			).rows;
		} catch(err) {
			log(err, 'error');
		}
	},

	beginConquest: async (planet, prevOwner, newOwner) => {
		try {
			const endDate = new Date();
			endDate.setDate(endDate.getDate() + 1);

			await serverClient.query(
				'INSERT INTO public."conquest" ("prevOwner", "newOwner", planet, "endDate") VALUES ($1, $2, $3, $4)',
				[prevOwner, newOwner, planet, endDate]
			);
		} catch(err) {
			log(err, 'error');
		}
	}
};