module.exports = class Planet {
	/**
	 * Gets the planet information.
	 *
	 * @param      {object}    user      User who asks for
	 * @param      {string}    pid       Planet ID
	 * @param      {number}    decalage  decalage de n°
	 * @param      {Function}  callback  Function needed to call back
	 */
	static find(user,pid,decalage,callback) {
		db.player.searchById(user.id, function(userReturned) {
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
				db.planet.find(pid,function(planetReturned) {
					db.fleet.findByMotherPlanet(planetReturned.id, function(fleetReturned) {
						callback(planetReturned,userReturned,fleetReturned);
					});
				});
			}
		});
	}

	/**
	 * Get, update then send planet data
	 *
	 * @param      {<type>}  data      data sent by user
	 * @param      {number}  decalage  le decalage de planete
	 */
	static refresh(inputData, callback, disableTutorials=false) {
		db.player.searchById(inputData.id, (userReturned) => {
			db.planet.findByOwner(inputData.id, (planetsReturned) => {
				for(const currPlanet of planetsReturned) {
					db.fleet.findByMotherPlanet(currPlanet.id, function(fleetsReturned) {
						const newPlanet = Planet.update(currPlanet,userReturned,fleetsReturned);

						db.planet.update(newPlanet);

						Fleets.refresh(newPlanet.address,inputData.sid);

						if(inputData.pid === currPlanet.address) {
							if(!disableTutorials && !Tutorials.hasFinishedTutorials(userReturned)) {
								db.unit.findByOwner(userReturned.id, (unitsList) => {
									const oldCount = Object.keys(userReturned.tutorials).length;

									userReturned = Tutorials.updateTutorialList(userReturned, newPlanet, fleetsReturned, unitsList);

									if(Object.keys(userReturned.tutorials).length !== oldCount) {
										db.player.update({
											id: userReturned.id,
											tutorials: userReturned.tutorials,
										});
									}

									Tutorials.checkTutorials(userReturned, newPlanet);
								});
							}

							if(callback) {
								callback(newPlanet);
							} else {
								Planet.sendPlanetDataToUser({data: newPlanet, id: inputData.id, sid: inputData.sid });
							}
						}
					});
				}
			});
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

		io.to(data.sid).emit('planet-recieve-data', data );
	}

	/**
	 * Calculates the new resources based on constants building level on a
	 * specific time period.
	 *
	 * @class      CalcNewResources (resources)
	 * @param      {array}   resources   The old resources
	 * @param      {number}  buildings   The buildings levels
	 * @param      {number}  planetType  The planet type
	 * @param      {number}  time        The time period
	 * @param      {object}  user        The user
	 */
	static CalcNewResources(resources,buildings,planetType,time,user,currentBuilding) {
		time = time/3600/1000; // Passage en heures

		const ratio = Resources.GetRatiosPerPlanet(planetType);
		const ratios = [ratio.ironRatio,ratio.aluRatio,ratio.copperRatio,ratio.titanRatio];

		const mineralProdBase = mineralProd[0]*Math.pow(buildings[0],2) + mineralProd[1]*buildings[0] + mineralProd[2];
		const metalProdBase   = metalProd[0]*Math.pow(buildings[1],2)   + metalProd[1]*buildings[1]   + metalProd[2];
		const heliumProdBase  = heliumProd[0]*Math.pow(buildings[13],2)  + heliumProd[1]*buildings[13]  + heliumProd[2];

		const [ mineralStorageBase, metalsStorageBase, storageHelium ] = Buildings.calcStorageCapacity(buildings[5], buildings[10], Research.isSearched(user, 'cp_molecular_compression'));

		//Minerals
		if(currentBuilding !== 0) {
			resources[0] += mineralProdBase*time;
		}

		//Helium 3
		if(buildings[13] !== 0 && currentBuilding !== 13) {
			resources[1] += heliumProdBase*time;
		}

		//Metals
		if(currentBuilding !== 1) {
			if(resources[0]-(metalProdBase*time) > 0) { //Verify if you can use basic ressources
				for(let i=2; i<6; i++) {
					resources[i] += (metalProdBase*time)*ratios[i-2];
				}

				resources[0] -= (metalProdBase*time); //Consomation Algorithm
			} else { // Do the max we can
				for(let i=2; i<6; i++) {
					resources[i] += resources[0]*ratios[i-2];
				}

				resources[0] = 0;
			}
		}

		// Si Max de tout les metaux
		if((resources[5]>metalsStorageBase*ratio.titanRatio) &&
			(resources[4]>metalsStorageBase*ratio.copperRatio) &&
			(resources[3]>metalsStorageBase*ratio.aluRatio) &&
			(resources[2]>metalsStorageBase*ratio.ironRatio)) {

			let min = (resources[2] - metalsStorageBase*ratios[0])/ratios[0];

			for(let i=3; i<6; i++) {
				const temp = (resources[i] - metalsStorageBase*ratios[i-2])/ratios[i-2];

				if(temp<min) {
					min = temp;
				}
			}
			resources[0]+=min;

			for(let i=2; i<6; i++) {
				resources[i] -= min*ratios[i-2];
			}
		}

		//Max Storage
		if(resources[0]>mineralStorageBase) {
			resources[0] = mineralStorageBase;
		}

		if(resources[1]>storageHelium) {
			resources[1] = storageHelium;
		}

		// On detruit tout ce qui est > au max
		for(let i=2; i<6; i++) {
			if(resources[i]>metalsStorageBase*ratios[i-2]) {
				resources[i] = metalsStorageBase*ratios[i-2];
			}
		}

		// Arrondi
		for(let i=0; i<resources.length; i++) {
			resources[i] = Math.round(resources[i] * 1000)/1000;
		}

		return resources;
	}

	static checkIfCanBuild(planet, user, cost, building, currTime) {
		let errormsg = '';

		// Cost verif
		if(cost.iron>planet.resources[2] || cost.aluminium>planet.resources[3] || cost.copper>planet.resources[4] || cost.titanium>planet.resources[5] ) {
			errormsg = 'BUILDING_ERROR_COST';
		}
		// Un bâtiment est déja en construction ?
		if(planet.nextBuildingTime > currTime) {
			errormsg = 'BUILDING_ERROR_ALREADY';
		}
		// Niveau maximum ?
		if(planet.Buildings[building]>buildingMaxLvl[building]) {
			errormsg = 'BUILDING_ERROR_MAXIMUM';
		}
		// Les requirements ?
		if(!Buildings.HasRequirements(user, planet, building)) {
			errormsg = 'BUILDING_ERROR_DEPENDENCIES';
		}

		planet.Buildings[building]++; // Only for calcs

		// Energie ? Habitants ?
		if(errormsg !== '') {
			if(!Buildings.enoughEnergy(planet.Buildings) && building<=globalConst.groundBuildingNumber && building!==4) { // Only ground buildings affected by this
				errormsg = 'BUILDING_ERROR_ENERGY';
			}
		}

		planet.Buildings[building]--; // Revert

		return errormsg;
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

		Planet.find(data,data.planet,0,function(planetReturned,userReturned,fleetReturned) {
			if(data.planet!==planetReturned.address) { // Stop if not belonging
				Websocket.SendMessageToClient({ sid: data.sid, message: 'ERROR_NOT_BELONGING' });
				log(data.username+' failed to update his building ('+data.building+') on planet ' + planetReturned.name +
					' (' + planetReturned.address + ') to next level because he doesn\'t own it !','fail');
				return;
			}

			let timeSpeed = 1;

			const currTime = Date.now();

			// Calc new planet data
			const newData = Planet.update(planetReturned,userReturned,fleetReturned);

			// Vars for this building tes
			const cost = Buildings.GetCost(data.building,newData.Buildings[data.building]+1);
			let errormsg = Planet.checkIfCanBuild(newData, userReturned, cost, data.building, currTime);

			newData.Buildings[data.building]++;
			Planet.enoughPeople(newData, fleetReturned, function(newData,enoughPeople) {
				if(!enoughPeople) {
					errormsg = 'BUILDING_ERROR_PEOPLE';
				}
				newData.Buildings[data.building]--; // Revert new building, it's not builded yet

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

					newData.nextBuildingTime = currTime+Math.round(cost.time*TIME.HOUR_TO_MS*timeSpeed);
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
		});
	}
	/**
	 * Update units
	 *
	 * @class      UpdateUnits (name)
	 * @param      {<type>}  planetIn  data needed to be updated
	 * @param      {<type>}  user      The user
	 */
	static UpdateUnits(planetIn,user,currTime) {
		const newPlanet = Object.assign({}, planetIn);
		newPlanet.unitBuildingEndTime = parseInt(newPlanet.unitBuildingEndTime);

		if(!newPlanet.unitBuildingID || !newPlanet.unitBuildingFleetID) {
			return;
		}

		db.fleet.find(newPlanet.unitBuildingFleetID, function(fleetReturned) {
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
				timeCost *= (1-(buildLvlUnitBuildingSpeedBonus*newPlanet.Buildings[7]));

				if(currTime>newPlanet.unitBuildingEndTime) { // total add
					const restantDepuisSynchro = Math.ceil((newPlanet.unitBuildingEndTime - newPlanet.lastUnitUpdate)/timeCost);
					unitCount = restantDepuisSynchro;

					fleetReturned.inBuilding = false;

					Websocket.sendNotification(user.sid, 'unit', { unitName: unitReturned.name, unitCount: newPlanet.unitBuildingCount });
				} else { // Partial add
					const restant = Math.ceil((newPlanet.unitBuildingEndTime - currTime)/timeCost);
					const restantDepuisSynchro = Math.ceil((newPlanet.unitBuildingEndTime - newPlanet.lastUnitUpdate)/timeCost);
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

				const popCost = (unitReturned.cost[5]>1)?unitReturned.cost[5]:1;
				fleetReturned.points = parseFloat(fleetReturned.points) + parseFloat(unitCount * popCost) * pointsCoef.units;
				fleetReturned.points = '' + fleetReturned.points;

				db.fleet.update(fleetReturned, function() {
					Units.refresh(user);
					Fleets.refresh(newPlanet.address,user.sid);
					Tactics.refresh(user.id, user.sid);
				});
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
	static update(planetData,user,fleetList) {
		const currTime = Date.now();

		// Update resources
		planetData.resources = Planet.UpdateResources(planetData,user);
		planetData.lastResourcesUpdate = currTime;

		// Update points
		planetData.points = Planet.calcPlanetPoints(planetData);
		planetData.points += parseFloat(Planet.calcFleetPoints(fleetList));
		planetData.points = Math.round(planetData.points);

		// Update buildings
		if(currTime>planetData.nextBuildingTime && planetData.nextBuilding !== -1) {
			planetData.Buildings[planetData.nextBuilding]++;

			Websocket.sendNotification(user.sid, 'building', { building: planetData.nextBuilding, lvl: planetData.Buildings[planetData.nextBuilding] });

			planetData.nextBuildingTime = -1;
			planetData.nextBuilding = -1;
		}

		// Update units
		if(planetData.unitBuildingEndTime !== -1) {
			Planet.UpdateUnits(Object.assign({}, planetData),user,currTime);
		}

		if(currTime>planetData.unitBuildingEndTime) {
			planetData.unitBuildingEndTime = -1;
			planetData.unitBuildingID = null;
			planetData.unitBuildingCount = 0;
			planetData.unitBuildingFleetID = null;
		}

		planetData.lastUnitUpdate = currTime;

		return planetData;
	}

	/**
	 * Gets the people count
	 *
	 * @param      {<type>}    planet    Planet data
	 * @param      {Function}  callback  Function needed to called back
	 */
	static getPeople(planetData, fleets, callback) {
		const buildings = planetData.Buildings;
		const prod = Math.round(habGen[0]*Math.pow(buildings[2],2) + habGen[1]*buildings[2] + habGen[2]);
		let cons = 0;

		// Buildings
		for(let i=0; i<14; i++) {
			if(buildings[i]===0) {
				continue;
			}

			if(i===planetData.nextBuilding) {
				// Current in-build building
				cons += parseInt(Buildings.GetCost(i,buildings[i] + 1).habitants);
				continue;
			}
			cons += parseInt(Buildings.GetCost(i,buildings[i]).habitants);
		}

		// Units builded and in-build
		for(let i=0; i<fleets.length; i++) {
			cons += fleets[i].population;
		}

		callback(planetData,prod,cons);
	}

	/**
	 * Is there enough people on planet ?
	 *
	 * @param      {Object}  buildings  The buildings list
	 */
	static enoughPeople(planetData, fleets, callback) {
		Planet.getPeople(planetData, fleets, function(planet, prod, cons) {
			if(prod<cons) {
				callback(planetData,false);
			}
			callback(planetData,true);
		});
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
	 * @param      {<type>}  dataIn  Input planet data
	 */
	static UpdateResources(dataIn,user) {
		const Dtime = Date.now()-dataIn.nextBuildingTime;
		let resources = dataIn.resources;

		if(Dtime<0 || parseInt(dataIn.nextBuildingTime) === -1) { // Cas ou aucun bâtiment est en construction ou quand le bâtiment n'est pas encore fini
			resources = Planet.CalcNewResources(resources,dataIn.Buildings,dataIn.planetType,(Date.now()-dataIn.lastResourcesUpdate),user,dataIn.nextBuilding);
		} else {
			// Calcul avec les anciens bâtiments jusqu'a l'update
			resources = Planet.CalcNewResources(resources,dataIn.Buildings,dataIn.planetType,(dataIn.nextBuildingTime-dataIn.lastResourcesUpdate),user,dataIn.nextBuilding);
			// Calcul avec les nouveaux bâtiments
			const tmpBuildings = dataIn.Buildings.slice();
			tmpBuildings[dataIn.nextBuilding]++;
			resources = Planet.CalcNewResources(resources,tmpBuildings,dataIn.planetType,Dtime,user,-1);
		}

		return resources;
	}

	static calcPlanetPoints(dataIn) {
		let points = 0;

		// Building points count
		for(let i=0; i<globalConst.buildingNumber; i++) {
			points += (dataIn.Buildings[i] * buildingPointCoef[i]);
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
