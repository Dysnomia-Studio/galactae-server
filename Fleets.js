module.exports = class Fleets extends require('./_shared/Fleets')._Fleets {
	static async endMove(currentFleet) {
		const ownerUser = await db.player.find(currentFleet.ownerId);

		if(currentFleet.orbitPosition === FLEET_MOVE_TYPE.ATTACK) {
			await Planet.refresh({
				id: ownerUser.id,
				sid: ownerUser.sid,
				username: ownerUser.name,
				pid: currentFleet.position,
			});

			const defPlanet = await db.planet.findbyAddress(currentFleet.position);
			const defUser = await db.player.find(defPlanet.owner);

			await Combat.beginFight(ownerUser.sid, defPlanet, ownerUser, defUser, currentFleet.id, new Date(currentFleet.endMoveTime));
		} else {
			await db.fleet.endMove(currentFleet.id);
		}

		Websocket.sendNotification(ownerUser.sid, 'fleetMove', { fleetName: currentFleet.name, destination: currentFleet.position });

		Fleets.syncNextFleet();
	}

	static async syncNextFleet() {
		clearTimeout(Fleets.nextFleetTimeout);

		const nextFleet = await db.fleet.getNextFleetToSync();

		if(nextFleet.endMoveTime === null) {
			return;
		}

		if(nextFleet.endMoveTime.getTime() <= Date.now()) {
			Fleets.endMove(nextFleet);
		} else {
			Fleets.nextFleetTimeout = setTimeout(() => {
				Fleets.endMove(nextFleet);
			}, nextFleet.endMoveTime.getTime() - Date.now());
		}
	}


	static async sendtoPlayer(FleetList, newPlanet, sid, address) {
		if(!isset(newPlanet, 'object')) {
			newPlanet = await db.planet.findbyAddress(address);
		} else {
			await db.planet.update({
				id: newPlanet.id,
				resources: newPlanet.resources,
			});
		}

		if(newPlanet.address === address) {
			Planet.sendPlanetDataToUser({data: {resources: newPlanet.resources}, planet: newPlanet.address, id: newPlanet.owner, sid: sid });

			if(globalCfg.dev) {
				log('Sending fleet');
			}

			for(const fleetId in FleetList) {
				if(FleetList[fleetId].ownerId !== newPlanet.owner) {
					const player = await db.player.find(FleetList[fleetId].ownerId);

					FleetList[fleetId] = Fleets.extractOrbitPublicInfo(FleetList[fleetId], player.name);
				}
			}

			io.to(sid).emit('fleet-recieve-data', { FleetList });
		}
	}

	/**
	 * Get and send unit data to user
	 *
	 * @param      {object}  pid     planet uid
	 * @param      {object}  sid     user socket id
	 * @return     {socket}  units   list of units types
	 */
	static async refresh(address,sid,playerAddress='') {
		if(playerAddress === '') {
			playerAddress = address;
		}

		if(globalCfg.dev) {
			log('Refresh fleets');
		}

		/**
		 * WARNING: NO SECURITY DETECTION IS MADE IN THAT FUNCTION
		 * YOU NEED TO AUTH USER AND PLANET BEFORE !
		 */
		let originalFList = await db.fleet.findAllFleetReferingToPosition(address);

		if(!originalFList) {
			originalFList = [];
		}

		Fleets.recalcFuel(address, originalFList, async(FleetList, newPlanet) => {
			if(!newPlanet) {
				Fleets.sendtoPlayer(FleetList, newPlanet, sid, playerAddress);
				return;
			}

			for(let i=0; i<FleetList.length; i++) {
				const id = i;

				// Autoremove fleet if needed
				if(FleetList[id].units.length === 0 && newPlanet.unitBuildingFleetID !== FleetList[id].id) {
					db.fleet.remove(FleetList[id].id);
					continue;
				}

				await db.fleet.update({
					id: FleetList[id].id,
					fuel: FleetList[id].fuel,
				});
			}

			Fleets.sendtoPlayer(FleetList, newPlanet, sid, playerAddress);
		});
	}

	static async recalcFuel(address, fleetList, callback) {
		let haveToUpdate = false;
		for(let i=0; i<fleetList.length; i++) {
			if(fleetList[i].fuel === undefined) {
				fleetList[i].fuel = 0;
			}

			if(fleetList[i].fuel < fleetList[i].maxFuel) {
				haveToUpdate = true;
			}
		}

		if(fleetList.length === 0) {
			callback(fleetList);
			return;
		}

		const planetData = await db.planet.findbyAddress(address);

		if(!haveToUpdate) {
			callback(fleetList, planetData);
			return;
		}

		const userData = await db.player.find(planetData.owner);

		let newPlanet;
		[newPlanet, fleetList] = Fleets.distributeFuel(planetData, fleetList.slice(0), userData);

		callback(fleetList, newPlanet);
	}

	static async create(data,planetData,callback) {
		/**
		 * WARNING: NO SECURITY DETECTION IS MADE IN THAT FUNCTION
		 * YOU NEED TO AUTH USER AND PLANET BEFORE !
		 */
		const oldFleetList = await db.fleet.findByMotherPlanet(planetData.address);

		// Check max count
		if(oldFleetList.length >= hqFleetCount[planetData.Buildings[6] - 1]) {
			log(data.username + ' failed to create a new fleet on ' + planetData.name + ' because it has maximal fleet count.');
			Websocket.SendMessageToClient({ sid: data.sid, message: 'FLEET_MAX_REACHED' });
			return;
		}

		// Check name
		for(let i=0; i<oldFleetList.length; i++) {
			if(oldFleetList[i].name === data.fleetName) {
				log(data.username + ' failed to create a new fleet on ' + planetData.name + ' because a fleet with this name already exists.');
				Websocket.SendMessageToClient({ sid: data.sid, message: 'FLEET_NAME_ALREADY_EXISTS' });
				return;
			}
		}

		// Add it to db
		const newFleet = {
			name: data.fleetName,
			ownerId: data.id,
			motherPlanetAddress: planetData.address,
			position: planetData.address,
			orbitPosition: FLEET_MOVE_TYPE.DEFEND,
			endMoveTime: null,
			units: [],
			population: 0,
			fuel: 0,
			maxFuel: 0,
			inBuilding: false,
		};

		await db.fleet.create(newFleet);

		// Send new list to client
		Fleets.refresh(planetData.address,data.sid);

		if(callback) {
			callback(
				(await db.fleet.findByMotherPlanet(planetData.address))
					.filter((f) => f.name === data.fleetName)[0]
			);
		}
	}

	static hasEnoughCarrier(currFleet, unitList) {
		let fighterCount = 0;
		let fighterCap   = 0;

		for(const u in unitList) {
			for(const f in currFleet.units) {
				if(f !== unitList[u].id) {
					continue;
				}

				if(unitList[u].shipType === 'SHIP_FIGHTER') {
					fighterCount += fighterWeight[unitList[u].shipShape] * currFleet.units[f];
				} else if(unitList[u].shipType === 'SHIP_CARRIER') {
					for(const p in unitList[u].parts) {
						if(unitList[u].parts[p].type === 'hangar') {
							fighterCap += hangarSize[unitList[u].parts[p].tech] * currFleet.units[f];
						}
					}
				}
			}

		}

		return fighterCount <= fighterCap;
	}

	static async getUnitsList(unitIdList) {
		const unitList = [];

		for(let i = 0; i < unitIdList.length; i++) {
			const unitReturned = await db.unit.findById(unitIdList[i]);

			if(isset(unitReturned, 'object')) {
				unitList.push(unitReturned);
			}
		}

		return unitList;
	}

	static async moveToWithThrow(user, fleetId, destination, moveType) {
		const now = new Date();

		if(moveType !== Math.round(moveType)) {
			moveType = -1;
		}
		if(moveType < FLEET_MOVE_TYPE.DEFEND || moveType > FLEET_MOVE_TYPE.SPY) {
			return;
		}
		if(moveType === FLEET_MOVE_TYPE.SPY) { // @TODO: remove this when adding spying
			return;
		}

		// Get Fleet data
		const fleetReturned = await db.fleet.find(fleetId);

		if(!isset(fleetReturned, 'object')) { // Does this fleet exists ?
			log('fleet not found');
			return;
		}

		if('' + fleetReturned.ownerId !== '' + user.id) {
			log('user doesn\'t own ths fleet');
			return;
		}

		if(fleetReturned.name === 'SHIP_DEF') { // Is this fleet movable ? (not defense fleet)
			return;
		}

		if(fleetReturned.inBuilding !== undefined && fleetReturned.inBuilding) { // Are units building in this fleet ?
			const error = new Error();

			error.name = 'IN_BUILDING_FLEET';
			error.message = user.username + ' failed to move fleet because units are building in this fleet.';

			throw error;
		}

		if(fleetReturned.endMoveTime !== null) { // Is this fleet moving ?
			const error = new Error();

			error.name = 'ALREADY_MOVING_FLEET';
			error.message = user.username + ' failed to move fleet because fleet is already moving to a planet.';

			throw error;
		}

		if(fleetReturned.position === destination) { // Current planet
			const error = new Error();

			error.name = 'ALREADY_AT_DESTINATION';
			error.message = user.username + ' failed to move fleet because fleet is already at destination.';

			throw error;
		}

		const systemeDepart = GameMap.getSystemFromAdress(fleetReturned.position);
		const systemeArrivee = GameMap.getSystemFromAdress(destination);

		const unitList = await Fleets.getUnitsList(Object.keys(fleetReturned.units));
		if(systemeDepart !== systemeArrivee && !Fleets.hasEnoughCarrier(fleetReturned, unitList)) {
			const error = new Error();

			error.name = 'NO_ENOUGHT_CARRIER';
			error.message = user.username + ' failed to move fleet because fleet hasn\'t enough carrier capacity.';

			throw error;
		}

		let minSpeed;
		if(systemeDepart === systemeArrivee) {
			minSpeed = Fleets.getMinSubSpeed(unitList, fleetReturned.units);
		} else {
			minSpeed = Fleets.getMinSupraSpeed(unitList, fleetReturned.units);
		}

		if(systemeDepart !== systemeArrivee && minSpeed.speed[0] === undefined) {
			const error = new Error();

			error.name = 'CANT_MAKE_SUPRAMOVE';
			error.message = user.username + ' failed to move fleet because some units can\'t make supraspeed move.';

			throw error;
		} else if(minSpeed.speed[0] === undefined) {
			const error = new Error();

			error.name = '';
			error.message = user.username + ' failed to move fleet because some units haven\'t speed data.';

			throw error;
		}

		const planeteDepart = await db.planet.findbyAddress(fleetReturned.position);
		const planeteArrivee = await db.planet.findbyAddress(destination);

		if(!isset(planeteArrivee, 'object')) {
			const error = new Error();

			error.name = 'DESTINATION_NOT_EXISTS';
			error.message = user.username + ' failed to move fleet because destination ('+destination+') does not exists.';

			throw error;
		}

		let defUser;
		if(moveType === FLEET_MOVE_TYPE.ATTACK) {
			defUser = await db.player.find(planeteArrivee.owner);

			if(isset(defUser, 'object') && defUser.beginnerProtectEnd.getTime() > now.getTime()) {
				const error = new Error();

				error.name = 'DESTINATION_IS_PROTECTED';
				error.message = user.username + ' failed to move fleet because defender ('+defUser.name+') has beginner protection.';

				throw error;
			}
		}

		let time;
		if(systemeDepart === systemeArrivee) {
			const baseDist = GameMap.getPlanetDistance(
				planeteDepart,
				planeteArrivee,
				now.getTime()/1000);
			if(Number.isNaN(baseDist) || baseDist < 0) {
				return;
			}
			const baseTravelTime = Fleets.calcMoveTime(baseDist, minSpeed.speed);

			const previewDist = GameMap.getPlanetDistance(
				planeteDepart,
				planeteArrivee,
				now.getTime()/1000 + Math.round(baseTravelTime*360000)/100);
			if(Number.isNaN(previewDist) || previewDist < 0) {
				return;
			}
			const previewTime = Fleets.calcMoveTime(previewDist, minSpeed.speed);

			/* Final travel time:
				Average of ...
				 Time to travel to planet where it's now
				and
				 Time to travel to planet where it'll be when we arrive to this previous position
			*/
			time = (baseTravelTime + previewTime)/2;
		} else {
			const dist = Math.sqrt(
				Math.pow(planeteDepart.galacticPos[0] - planeteArrivee.galacticPos[0],2) +
				Math.pow(planeteDepart.galacticPos[1] - planeteArrivee.galacticPos[1],2)
			);

			time = Fleets.calcMoveTime(dist, minSpeed.speed);
		}

		const fuel = Fleets.calcFuelCost(minSpeed.engines);
		if(!isset(fleetReturned.fuel, 'number') || fleetReturned.fuel < (fuel * time)) {
			const error = new Error();

			error.name = 'NO_ENOUGH_FUEL';
			error.message = user.username + ' failed to move fleet because fleet hasn\'t enough fuel.';

			throw error;
		}

		fleetReturned.fuel -= fuel * time;

		const atkUser = await db.player.find(user.id);
		if(!isset(atkUser, 'object')) {
			return;
		}

		let instability = time * 0.001 * (Math.random() - 0.5);
		if(Research.isSearched(atkUser, 'prop_suprastability')) {
			instability /= 2;
		}

		fleetReturned.endMoveTime = new Date(
			now.getTime() +
			Math.round((time + instability) *
			TIME.HOUR_TO_MS /
			globalCfg.gameSpeeds.unitMoving
		));
		fleetReturned.position = destination;
		fleetReturned.orbitPosition = moveType;
		if(destination === fleetReturned.motherPlanetAddress) {
			fleetReturned.orbitPosition = FLEET_MOVE_TYPE.DEFEND;
		}

		let textDestination = destination;
		if(typeof planeteArrivee.name !== 'undefined') {
			textDestination = planeteArrivee.name + ' (' + destination + ')';
		}

		const endTime = new Date(fleetReturned.endMoveTime);

		log(user.username + ' began to move fleet (type: ' + moveType + ') ' + fleetReturned.name + ' to ' + textDestination +
			'. ETA: ' + getDateTime(endTime));

		if(moveType === FLEET_MOVE_TYPE.ATTACK && isset(defUser)) {
			Websocket.sendNotification(defUser.sid, 'attack', {
				player: atkUser.name,
				origin: (planeteDepart.name) ? planeteDepart.name : planeteDepart.address,
				destination: (planeteArrivee.name) ? planeteArrivee.name : planeteArrivee.address,
				arriveTime: endTime,
			});
		}

		await db.fleet.update(fleetReturned);

		Websocket.SendMessageToClient({ sid: user.sid, message: 'FLEET_MOVING' });
		Fleets.refresh(fleetReturned.motherPlanetAddress, user.sid);
		Fleets.syncNextFleet();
	}

	static async moveTo(user, fleetId, destination, moveType) {
		try {
			return await Fleets.moveToWithThrow(user, fleetId, destination, moveType);
		} catch(e) {
			if(e.message !== '') {
				log(e.message);
			}

			if(e.name !== '') {
				Websocket.SendMessageToClient({ sid: user.sid, message: e.name });
			}
		}
	}

	static async renameFleet(data) {
		const fleetReturned = await db.fleet.find(data.fleetId);

		if(!isset(fleetReturned, 'object') || !isset(fleetReturned.ownerId, 'string') || ''+fleetReturned.ownerId !== ''+data.id) {
			return;
		}
		if(fleetReturned.name === 'SHIP_DEF') {
			return;
		}

		const newFleet = {
			id: fleetReturned.id,
			name: data.fleetNewName,
		};

		await db.fleet.update(newFleet);

		log(data.username + ' has succed to rename fleet type old:' + fleetReturned.name + ', new: ' + data.fleetNewName,'success');
		Fleets.refresh(fleetReturned.motherPlanetAddress, data.sid);
	}

	static moveUnits(unitId, count, from, to) {
		if(count <= 0) {
			return [-1];
		}

		if(from.units[unitId] < count) {
			log('Failed to move units from fleet ' + from.name + ' to ' + to.name + ' because the unit count was incorrect.', 'fail');
			return [-1];
		}

		if(!to.units[unitId]) {
			to.units[unitId] = 0;
		}
		from.units[unitId] -= count;
		to.units[unitId] += count;

		return [from, to];
	}

	static async fetchFleets(from, to, data, callback) {
		if(typeof(from) === 'string') {
			const fleetData = await db.fleet.find(from);
			if(!isset(fleetData, 'object') || !isset(fleetData.name, 'string') || fleetData.name === 'SHIP_DEF' || ''+fleetData.ownerId !== data.id) {
				return;
			}
			Fleets.fetchFleets(fleetData, to, data, callback);
			return;
		}
		if(typeof(to) === 'string') {
			const fleetData = await db.fleet.find(to);
			if(!isset(fleetData, 'object') || !isset(fleetData.name, 'string') || fleetData.name === 'SHIP_DEF' || ''+fleetData.ownerId !== data.id) {
				return;
			}
			Fleets.fetchFleets(from, fleetData, data, callback);
			return;
		}

		callback(from, to, data);
	}

	static async transferSomeUnits(from, to, data) {
		data.unitCount = parseInt(data.unitCount);
		if(Number.isNaN(data.unitCount)) {
			return;
		}

		if(typeof(from) === 'string' || typeof(to) === 'string') {
			Fleets.fetchFleets(from, to, data, Fleets.transferSomeUnits);
			return;
		}

		if(from.position !== to.position || from.endMoveTime !== null || to.endMoveTime !== null) {
			log(data.username + ' has failed to tranfer units from fleet ' + from.name + ' to ' + to.name + ' because wasn\'t at the same position.', 'fail');
			Websocket.SendMessageToClient( { sid: data.sid, message: 'FLEET_AT_DIFFERENT_POSITIONS' });
			return;
		}

		// @TODO: check people limit for fleet & planet

		[from, to] = Fleets.moveUnits(data.unitId, data.unitCount, from, to);

		if(from === -1) {
			return;
		}

		const unit = await db.unit.findById(data.unitId);

		if(!isset(unit, 'object') || !isset(unit.shipShape, 'string')) {
			return;
		}

		// Transfer fuel
		const transferMaxFuel = fuelStorage[unit.shipShape] * data.unitCount;
		const transferFuel = Math.round(transferMaxFuel/from.maxFuel * from.fuel);

		from.maxFuel -= transferMaxFuel;
		to.maxFuel += transferMaxFuel;

		from.fuel -= transferFuel;
		to.fuel += transferFuel;

		// @TODO: move cargo

		Fleets.removeEmptyUnits(from);

		await db.fleet.update(from);
		await db.fleet.update(to);

		log(data.username + ' has tranfered units from fleet ' + from.name + ' to ' + to.name + ' orbiting planet ' + from.position);
		Websocket.SendMessageToClient( { sid: data.sid, message: 'FLEET_UNIT_TRANSFER_SUCCESSFUL' });
		Fleets.refresh(from.motherPlanetAddress, data.sid);
	}

	static async mergeFleet(from, to, data) {
		if(typeof(from) === 'string' || typeof(to) === 'string') {
			Fleets.fetchFleets(from, to, data, Fleets.mergeFleet);
			return;
		}

		if(from.position !== to.position || from.endMoveTime !== null || to.endMoveTime !== null) {
			log(data.username + ' has failed merging fleet ' + from.name + ' to ' + to.name + ' because wasn\'t at the same position.', 'fail');
			Websocket.SendMessageToClient( { sid: data.sid, message: 'FLEET_AT_DIFFERENT_POSITIONS' });
			return;
		}

		// @TODO: check people limit for fleet & planet

		for(const key in from.units) {
			[from, to] = Fleets.moveUnits(key, from.units[key], from, to);
			if(from === -1) {
				return;
			}
		}

		from.units = [];

		// Move fuel
		to.fuel += from.fuel;
		to.maxFuel += from.maxFuel;

		// @TODO: move cargo

		await db.fleet.update(from);
		await db.fleet.update(to);

		log(data.username + ' has merged fleet ' + from.name + ' to ' + to.name + ' orbiting planet ' + from.position);
		Websocket.SendMessageToClient( { sid: data.sid, message: 'FLEET_MERGE_SUCCESSFUL' });
		Fleets.refresh(from.motherPlanetAddress, data.sid);
	}

	static async transferFuelBetweenFleets(from, to, data) {
		if(typeof(from) === 'string' || typeof(to) === 'string') {
			Fleets.fetchFleets(from, to, data, Fleets.transferFuelBetweenFleets);
			return;
		}

		if(from.position !== to.position || from.endMoveTime !== null || to.endMoveTime !== null) {
			log(data.username + ' has failed tranfering fuel from fleet ' + from.name + ' to ' + to.name + ' because wasn\'t at the same position.', 'fail');
			Websocket.SendMessageToClient( { sid: data.sid, message: 'FLEET_AT_DIFFERENT_POSITIONS' });
			return;
		}

		data.fuelCount = parseInt(data.fuelCount);
		if(Number.isNaN(data.fuelCount) || data.fuelCount <= 0) {
			return;
		}
		if(from.fuel <= data.fuelCount) {
			return;
		}

		from.fuel -= data.fuelCount;
		to.fuel += data.fuelCount;

		if(to.fuel > to.maxFuel) {
			from.fuel += (to.fuel - to.maxFuel);
			to.fuel = to.maxFuel;
		}

		await db.fleet.update(from);
		await db.fleet.update(to);

		log(data.username + ' has tranfered fuel from fleet ' + from.name + ' to ' + to.name + ' orbiting planet ' + from.position);
		Websocket.SendMessageToClient( { sid: data.sid, message: 'FUEL_TRANSFER_SUCCESSFUL' });
		Fleets.refresh(from.motherPlanetAddress, data.sid);
	}

	static extractPublicInfo(fleet, playerName, unitsList) {
		const outputFleet = {
			id: fleet.id,
			name: fleet.name,
			owner: playerName,
			units: [],
		};

		for(const unitId in fleet.units) {
			let unitsListId = unitId;
			if(typeof specialUnitsUID[unitsListId] !== 'undefined') {
				unitsListId = specialUnitsUID[unitsListId];
			}

			outputFleet.units.push({
				...Units.extractPublicInfo(unitsList[unitsListId]),
				count: fleet.units[unitId],
			});
		}

		return outputFleet;
	}

	static extractOrbitPublicInfo(fleet, playerName) {
		return {
			id: fleet.id,
			name: fleet.name,
			owner: playerName,
			position: fleet.position,
			endMoveTime: fleet.endMoveTime,
			units: [], // @TODO
		};
	}
};
