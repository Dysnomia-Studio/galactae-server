module.exports = class Planet {
	/**
	 * Gets the planet information.
	 *
	 * @param      {object}    user      User who asks for
	 * @param      {string}    pid       Planet ID
	 * @param      {number}    decalage  decalage de n°
	 * @param      {Function}  callback  Function needed to call back
	 */
	static async find(user, pid, decalage, callback) {
		const userReturned = await db.player.find(user.id);

		if(isset(userReturned, 'object') && isset(userReturned.planetlist, 'array') && isset(userReturned.planetlist[0], 'string')) {
			const nbPlanetes = userReturned.planetlist.length;
			let valid = false;

			for(let i=0; i<nbPlanetes; i++) {
				if(pid===userReturned.planetlist[i]) { // Cas où le joueur a les bonnes infos
					if(i===0 && decalage < 0) {
						pid = userReturned.planetlist[nbPlanetes+decalage];
					} else if(i>=(nbPlanetes-decalage) && decalage > 0) {
						pid = userReturned.planetlist[decalage-1];
					} else {
						pid = userReturned.planetlist[i+decalage];
					}

					valid = true;
					break;
				}
			}
			// Si pas d'info, on met la premiere planete dans la liste
			if(!valid) {
				pid = userReturned.planetlist[0];
			}
			db.planet.find(pid,async function(planetReturned) {
				const fleetReturned = await db.fleet.findByMotherPlanet(planetReturned.address);
				callback(planetReturned,userReturned,fleetReturned);
			});
		}
	}

	static async traitementsPlanete(currPlanet, userReturned, inputData, disableTutorials, callback) {
		let fleetsReturned = [];
		if(currPlanet.owner === inputData.id) {
			fleetsReturned = await db.fleet.findByMotherPlanet(currPlanet.address);
		}
		const newPlanet = await Planet.update(currPlanet,userReturned,fleetsReturned);

		db.planet.update(newPlanet);

		Fleets.refresh(newPlanet.address,inputData.sid,inputData.pid);

		if(inputData.pid === currPlanet.address) {
			if(!disableTutorials && !Tutorials.hasFinishedTutorials(userReturned)) {
				const unitsList = await db.unit.findByOwner(userReturned.id);
				const oldCount = Object.keys(userReturned.tutorials).length;

				userReturned = Tutorials.updateTutorialList(userReturned, newPlanet, fleetsReturned, unitsList);

				if(Object.keys(userReturned.tutorials).length !== oldCount) {
					db.player.update({
						id: userReturned.id,
						tutorials: userReturned.tutorials,
					});
				}

				Tutorials.checkTutorials(userReturned, newPlanet);
			}

			if(callback) {
				callback(newPlanet);
			} else {
				Planet.sendPlanetDataToUser({data: newPlanet, id: inputData.id, sid: inputData.sid });
			}

			return true;
		}
	}

	/**
	 * Get, update then send planet data
	 *
	 * @param      {<type>}  data      data sent by user
	 * @param      {number}  decalage  next/prev
	 */
	static async refresh(inputData, callback, disableTutorials=false) {
		const userReturned = await db.player.find(inputData.id);

		if(!isset(userReturned, 'object')) {
			return;
		}

		let found = false;
		db.planet.findByOwner(inputData.id, async(planetsReturned) => {
			for(const currPlanet of planetsReturned) {
				if(await Planet.traitementsPlanete(currPlanet, userReturned, inputData, disableTutorials, callback)) {
					found = true;
				}
			}

			if(!found) {
				const conquestList = await db.conquest.getActiveConquestsOnPlanet(inputData.pid);

				for(const conquest of conquestList) {
					if(conquest.newOwner === inputData.id) {
						const currPlanet = await db.planet.findbyAddress(conquest.planet);

						delete currPlanet.owner;

						Planet.traitementsPlanete(currPlanet, userReturned, inputData, true, callback);

						found = true;
					}
				}
			}

			if(!found) {
				inputData.pid = planetsReturned[0].address;
				await Planet.traitementsPlanete(planetsReturned[0], userReturned, inputData, disableTutorials, callback);
			}
		});
	}

	static getWholeSystem(inputData) {
		db.planet.findBySystemWithOwners(inputData.systemAddress, function(planetList) {
			const retour = {};

			for(let i=0; i<planetList.length; i++) {
				const p = planetList[i];

				retour[p.address] = {
					name: p.name,
					ownerName: p.ownerName,
					ally: p.ally,
					points: p.points,
					orbitDist: p.orbitDist,
					orbitDuration: p.orbitDuration,
					galacticPos: p.galacticPos,
					planetType: p.planetType,
				};
			}

			retour.systemAddress = inputData.systemAddress;

			io.to(inputData.sid).emit('map-recieve-data', retour);
		});
	}

	/**
	 * Send planet data to user
	 *
	 * @param      {<type>}  data    data
	 */
	static sendPlanetDataToUser(data) {
		data.sNow = Date.now();

		if(globalCfg.dev) {
			log('Sending planet');
		}

		delete data.id;
		delete data.data.id;

		io.to(data.sid).emit('planet-recieve-data', data );
	}

	/**
	 * Do we can upgrade a building ? And if yes build it !
	 *
	 * @class      TryBuilding (name)
	 * @param      {<type>}  data    data
	 */
	static build(data) {
		// Mauvais n° de batiment
		if(data.building > globalConst.buildingNumber || data.building < 0) { // Stop Executing, it may create bugs;
			return;
		}

		Planet.find(data,data.planet,0,async function(planetReturned,userReturned,fleetReturned) {
			if(data.planet!==planetReturned.address) { // Stop if not belonging
				Websocket.SendMessageToClient({ sid: data.sid, message: 'ERROR_NOT_BELONGING' });
				log(data.username+' failed to update his building ('+data.building+') on planet ' + planetReturned.name +
					' (' + planetReturned.address + ') to next level because he doesn\'t own it !','fail');
				return;
			}

			const conquestList = await db.conquest.getActiveConquestsOnPlanet(planetReturned.address);
			if(conquestList.length > 0) {
				log(data.username+' failed to update his building ('+data.building+') on planet ' + planetReturned.name +
					' (' + planetReturned.address + ') to next level because the planet is being conquested.','fail');
				return;
			}

			let timeSpeed = 1;

			const currTime = new Date();

			// Calc new planet data
			const newData = await Planet.update(planetReturned,userReturned,fleetReturned);

			// Vars for this building tests
			const cost = Buildings.GetCost(data.building,newData.Buildings[data.building]+1);
			const errormsg = Buildings.checkIfCanBuild(newData, fleetReturned, userReturned, cost, data.building, currTime);

			if(errormsg === '') {
				// Research bonus
				if(Research.isSearched(userReturned,'cp_mecanisation')) {
					timeSpeed += researchBonus.cp_mecanisation;
				}

				if(data.building >= globalConst.groundBuildingNumber) {
					if(Research.isSearched(userReturned,'cp_tracteur')) {
						timeSpeed += researchBonus.cp_tracteur;
					}
					if(Research.isSearched(userReturned,'cp_materielTp')) {
						timeSpeed += researchBonus.cp_materielTp;
					}

					// Faster if shipyard have higher lvl
					cost.time *= (1-(buildLvlUnitBuildingSpeedBonus*newData.Buildings[7]));
				}

				// We consume resources
				newData.resources[2] -= cost.iron;
				newData.resources[3] -= cost.aluminium;
				newData.resources[4] -= cost.copper;
				newData.resources[5] -= cost.titanium;

				newData.nextBuildingTime = new Date(currTime.getTime() + Math.round(cost.time*TIME.HOUR_TO_MS*timeSpeed));
				newData.nextBuilding = data.building;

				Websocket.SendMessageToClient({ sid: data.sid, message: 'BUILD_OK'});
				log(data.username+' updated building '+data.building+' on planet ' + planetReturned.name + ' (' + planetReturned.address + ') to next level','success');

			} else { // We just update ressources
				delete newData.Buildings;

				Websocket.SendMessageToClient({ sid: data.sid, message: errormsg });
				log(data.username+' failed to update building '+data.building+' on planet ' + planetReturned.name + ' (' + planetReturned.address + ') to next level ' + errormsg,'fail');
			}

			db.planet.update(newData);

			Planet.sendPlanetDataToUser({data: newData, planet: data.planet, id: data.id, sid: data.sid });
		});
	}
	/**
	 * Update units
	 *
	 * @class      UpdateUnits (name)
	 * @param      {<type>}  planetIn  data needed to be updated
	 * @param      {<type>}  user      The user
	 */
	static async UpdateUnits(planetIn,user,currTime) {
		const newPlanet = Object.assign({}, planetIn);

		if(!newPlanet.unitBuildingID || !newPlanet.unitBuildingFleetID || !newPlanet.unitBuildingEndTime) {
			return;
		}

		const fleetReturned = await db.fleet.find(newPlanet.unitBuildingFleetID);

		if(!isset(fleetReturned, 'object') || !isset(fleetReturned.ownerId, 'string') || fleetReturned.ownerId !== user.id) {
			return;
		}

		db.unit.find(newPlanet.unitBuildingID, function(unitReturned) {
			const key = Object.keys(specialUnitsUID).find((key) => specialUnitsUID[key] === newPlanet.unitBuildingID);
			if(key !== undefined) {
				newPlanet.unitBuildingID = key;

				unitReturned = {};
				unitReturned.id = newPlanet.unitBuildingID;
				unitReturned.shipType = 'SHIP_DEF';
				unitReturned.name = key;
				unitReturned.cost = shipCosts[newPlanet.unitBuildingID];
				unitReturned.ownerId = user.id;
			}

			let unitCount = 0;

			if(fleetReturned.maxFuel === undefined) {
				fleetReturned.maxFuel = 0;
			}

			let timeCost = unitReturned.cost[4]*TIME.HOUR_TO_MS;
			timeCost *= (1-(buildLvlUnitBuildingSpeedBonus*(newPlanet.Buildings[7] + newPlanet.Buildings[11])));

			const restantDepuisSynchro = Math.ceil((newPlanet.unitBuildingEndTime.getTime() - newPlanet.lastUnitUpdate.getTime())/timeCost);
			if(currTime.getTime()>newPlanet.unitBuildingEndTime.getTime()) { // total add
				unitCount = restantDepuisSynchro;

				fleetReturned.inBuilding = false;

				Websocket.sendNotification(user.sid, 'unit', { unitName: unitReturned.name, unitCount: newPlanet.unitBuildingCount });
			} else { // Partial add
				const restant = Math.ceil((newPlanet.unitBuildingEndTime.getTime() - currTime.getTime())/timeCost);
				unitCount = restantDepuisSynchro - restant;
			}

			if(unitCount === 0) { // Prevent some bugs
				return;
			}

			if(unitCount > newPlanet.unitBuildingCount) { // Ca ne devrait jamais arriver, dans le pire des cas la derniere update est la demande de construction
				unitCount = newPlanet.unitBuildingCount;
			}

			if(!fleetReturned.units[newPlanet.unitBuildingID]) {
				fleetReturned.units[newPlanet.unitBuildingID] = 0;
			}
			fleetReturned.units[newPlanet.unitBuildingID] += unitCount;

			if(unitReturned.shipType !== 'SHIP_DEF' && fuelStorage[unitReturned.shipShape]) {
				fleetReturned.maxFuel += fuelStorage[unitReturned.shipShape] * unitCount;
			}

			db.fleet.update(fleetReturned, function() {
				Units.refresh(user);
				Fleets.refresh(newPlanet.address,user.sid);
				Tactics.refresh(user.id, user.sid);
			});
		});
	}

	/**
	 * Update the planet data
	 *
	 * @class      update (name)
	 * @param      {<type>}  planetIn  data needed to be updated
	 * @param      {<type>}  user      The user
	 * @return     {<type>}  the updated data
	 */
	static async update(planetData,user,fleetList) {
		const currTime = new Date();

		const conquestList = await db.conquest.getActiveConquestsOnPlanet(planetData.address);

		// Update resources
		if(conquestList.length === 0) {
			planetData.resources = Planet.UpdateResources(planetData,user);
		}
		planetData.lastResourcesUpdate = currTime;

		// Update points
		planetData.points = Planet.calcPlanetPoints(planetData);
		planetData.points += parseFloat(Planet.calcFleetPoints(fleetList));
		planetData.points = Math.round(planetData.points);

		// Update buildings
		if(conquestList.length === 0 && planetData.nextBuildingTime !== null && currTime.getTime() > planetData.nextBuildingTime.getTime() && planetData.nextBuilding !== -1) {
			planetData.Buildings[planetData.nextBuilding]++;

			Websocket.sendNotification(user.sid, 'building', { building: planetData.nextBuilding, lvl: planetData.Buildings[planetData.nextBuilding] });

			planetData.nextBuildingTime = null;
			planetData.nextBuilding = -1;
		}

		// Update units
		if(conquestList.length === 0 && planetData.unitBuildingEndTime !== null) {
			Planet.UpdateUnits(Object.assign({}, planetData), user, currTime);

			if(currTime.getTime() > planetData.unitBuildingEndTime.getTime()) {
				planetData.unitBuildingEndTime = null;
				planetData.unitBuildingID = null;
				planetData.unitBuildingCount = 0;
				planetData.unitBuildingFleetID = null;
			}
		}

		planetData.lastUnitUpdate = currTime;

		return planetData;
	}

	/**
	 * Change the planet name
	 *
	 * @class      rename (name)
	 * @param      {<type>}  data    data
	 */
	static rename(data) {
		Planet.find(data,data.planet,0,function(planetReturned) {
			if(data.planet!==planetReturned.address) { // Stop if not belonging
				Websocket.SendMessageToClient({ sid: data.sid, message: 'ERROR_NOT_BELONGING' });
				log(data.username+' failed to change name on planet ' + planetReturned.name + ' (' + planetReturned.address + ') he doesn\'t own it !','fail');
				return;
			}

			// Planetes sans nom ...
			let empty = true;
			for(let i=0; i<data.name.length; i++) {
				if(data.name[i]!==' ') {
					empty = false;
					break;
				}
			}
			if(empty) {
				return;
			}

			const replace = [
				['<',''],
				['>',''],
				['/',''],
			];

			for(let i=0; i<replace.length; i++) {
				data.name = data.name.split(replace[i][0]).join(replace[i][1]);
			}

			log(data.username+' renamed its planet ' + planetReturned.name +' (' +data.planet+'), new name: '+data.name);

			Planet.sendPlanetDataToUser({data: {name: data.name}, planet: data.planet, id: data.id, sid: data.sid });

			planetReturned.name = data.name;

			db.planet.update(planetReturned);
		});
	}
	/**
	 * Calculates the resources.
	 *
	 * @class      CalcResources (name)
	 * @param      {<type>}  planetData  Input planet data
	 */
	static UpdateResources(planetData,user) {
		const nextBuildingTime = (planetData.nextBuildingTime === null) ? -1 : planetData.nextBuildingTime.getTime();
		const Dtime = Date.now()-nextBuildingTime;
		let resources = planetData.resources;

		if(Dtime<0 || !planetData.nextBuildingTime) { // Cas ou aucun bâtiment est en construction ou quand le bâtiment n'est pas encore fini
			resources = Resources.CalcNewResources(resources, planetData.Buildings, planetData.planetType, (Date.now()-planetData.lastResourcesUpdate.getTime()), user, planetData.nextBuilding);
		} else {
			// Calcul avec les anciens bâtiments jusqu'a l'update
			resources = Resources.CalcNewResources(resources, planetData.Buildings, planetData.planetType, (nextBuildingTime-planetData.lastResourcesUpdate.getTime()), user, planetData.nextBuilding);
			// Calcul avec les nouveaux bâtiments
			const tmpBuildings = planetData.Buildings.slice();
			tmpBuildings[planetData.nextBuilding]++;
			resources = Resources.CalcNewResources(resources, tmpBuildings, planetData.planetType, Dtime, user, -1);
		}

		return resources;
	}

	static calcPlanetPoints(planetData) {
		let points = 0;

		// Building points count
		for(let i=0; i<globalConst.buildingNumber; i++) {
			points += (planetData.Buildings[i] * buildingPointCoef[i]);
		}

		return points;
	}

	static calcFleetPoints(fleets) {
		let points = 0;

		// Building points count
		for(let i=0; i<fleets.length; i++) {
			points += parseFloat(fleets[i].points);
		}

		return points;
	}

	static setPriorityFleet(planet, fleet, sid) {
		db.planet.find(planet, function(planetData) {
			db.planet.update({ id: planetData.id, highPriorityFleet: fleet }, function() {
				Planet.sendPlanetDataToUser({ data: { address: planet, highPriorityFleet: fleet }, sid: sid });
				Fleets.refresh(planetData.address, sid);
			});
		});
	}
};
