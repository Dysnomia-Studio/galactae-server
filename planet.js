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
			if(isset(userReturned) && isset(userReturned.planetlist) && isset(userReturned.planetlist[0])) {
				let longueur = userReturned.planetlist.length;
				let valid = false;

				for(let i=0; i<longueur; i++) {
					if(pid===userReturned.planetlist[i]) { // Cas où le joueur a les bonnes infos
					    if(i===0 && decalage < 0) {
					    	pid = userReturned.planetlist[longueur+decalage];
					    } else if(i>=(longueur-decalage) && decalage > 0) {
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
					db.fleet.findByMotherPlanet(planetReturned._id, function(fleetReturned) {
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
	static refresh(data,decalage=0) {
		Planet.find(data,data.pid,decalage,function(planetReturned,userReturned,fleetReturned) {
			let newData = Planet.update(planetReturned,userReturned,fleetReturned);

			db.planet.update(newData);

			Fleet.refresh(newData._id,data.sid);

			Planet.sendPlanetDataToUser({data: newData, id: data.id, sid: data.sid });
		});
	}

	static getWholeSystem(data) {
		db.planet.findBySystemWithOwners(data.systemAddress, function(planetList) {
			let retour = {};

			for(let i=0; i<planetList.length; i++) {
				let p = planetList[i];

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

			retour.systemAddress = data.systemAddress;

			io.to(data.sid).emit('map-recieve-data', retour);
		});
	}

	/**
	 * Send planet data to user
	 *
	 * @param      {<type>}  data    data
	 */
	static sendPlanetDataToUser(data) {
		data.sNow = Date.now();

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

		let ratio = Resources.GetRatiosPerPlanet(planetType);
		let ratios = [ratio.ironRatio,ratio.aluRatio,ratio.copperRatio,ratio.titanRatio];

		let mineralProdBase = mineralProd[0]*Math.pow(buildings[0],2) + mineralProd[1]*buildings[0] + mineralProd[2];
		let metalProdBase   = metalProd[0]*Math.pow(buildings[1],2)   + metalProd[1]*buildings[1]   + metalProd[2];
		let heliumProdBase  = heliumProd[0]*Math.pow(buildings[13],2)  + heliumProd[1]*buildings[13]  + heliumProd[2];

		let mineralStorageBase, metalsStorageBase, storageHelium;
		[ mineralStorageBase, metalsStorageBase, storageHelium ] = Buildings.calcStorageCapacity(buildings[5], buildings[10], research.isSearched(user, 'cp_molecular_compression'));

		//Minerals
		if(currentBuilding!==0) {
			resources[0] += mineralProdBase*time;
		}

		//Helium 3
		if(buildings[13]!==0 && currentBuilding!==13) { resources[1] += heliumProdBase*time; }

		//Metals
		if(resources[0]-(metalProdBase*time)>0 && currentBuilding!==1) { //Verify if you can use basic ressources
		    for(let i=2; i<6; i++) {
		    	resources[i] += (metalProdBase*time)*ratios[i-2];
		    }

			resources[0] -= (metalProdBase*time); //Consomation Algorithm
		} else if(currentBuilding!==1) { // Do the max we can
		    for(let i=2; i<6; i++) {
		    	resources[i] += resources[0]*ratios[i-2];
		    }

			resources[0] = 0;
		}

		// Si Max de tout les metaux
		if((resources[5]>metalsStorageBase*ratio.titanRatio) &&
			(resources[4]>metalsStorageBase*ratio.copperRatio) &&
			(resources[3]>metalsStorageBase*ratio.aluRatio) &&
			(resources[2]>metalsStorageBase*ratio.ironRatio)) {

			let min = (resources[2] - metalsStorageBase*ratios[0])/ratios[0];

			for(let i=3; i<6; i++) {
				let temp = (resources[i] - metalsStorageBase*ratios[i-2])/ratios[i-2];

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
	    for(let i=2; i<6; i++) {
	    	if(resources[i]>metalsStorageBase*ratios[i-2]) { // You can't have more iron than your storage capacity
				resources[i] = metalsStorageBase*ratios[i-2];
			}
	    }

		return resources;
	}

	/**
	 * Do we can upgrade a building ? And if yes build it !
	 *
	 * @class      TryBuilding (name)
	 * @param      {<type>}  data    data
	 */
	static build(data) {
		// Mauvais n° de batiment
		if(data.building>14||data.building<0) { return; } // Stop Executing, it may create bugs;

		Planet.find(data,data.planet,0,function(planetReturned,userReturned,fleetReturned) {
			if(data.planet!==planetReturned.id) { // Stop if not belonging
				Websocket.SendMessageToClient({ sid: data.sid, message: 'ERROR_NOT_BELONGING' });
				log(data.username+' failed to update his building ('+data.building+') on planet ' + planetReturned.name +
					' (' + planetReturned.address + ') to next level because he doesn\'t own it !','fail');
				return;
			}

			let timeSpeed = 1;

			let currTime = Date.now();

			// Calc new planet data
			let newData = Planet.update(planetReturned,userReturned,fleetReturned);

			// Vars for this building tes
			let cost = Buildings.GetCost(data.building,newData.Buildings[data.building]+1);
			let BlockBuild = false;
			let errormsg = 'BUILD_ERROR'; // Message d'erreur par defaut
				// Cost verif
				if(cost.iron>newData.resources[2] || cost.aluminium>newData.resources[3] || cost.copper>newData.resources[4] || cost.titanium>newData.resources[5] ) {
					BlockBuild = true;
					errormsg = 'BUILDING_ERROR_COST';
				}
				// Un bâtiment est déja en construction ?
				if(newData.nextBuildingTime > currTime) {
					BlockBuild = true;
					errormsg = 'BUILDING_ERROR_ALREADY';
				}
				// Niveau maximum ?
				if(newData.Buildings[data.building]>buildingMaxLvl[data.building]) {
					BlockBuild = true;
					errormsg = 'BUILDING_ERROR_MAXIMUM';
				}
				// Les requirements ?
				if(!Buildings.HasRequirements(userReturned, newData, data.building)) {
					BlockBuild = true;
					errormsg = 'BUILDING_ERROR_DEPENDENCIES';
				}

				newData.Buildings[data.building]++; // Only for calcs

				// Energie ? Habitants ?
				if(!BlockBuild) {	
					if(!Buildings.enoughtEnergy(newData.Buildings) && data.building<=9 && data.building!==4) { // Only ground buildings affected by this
						BlockBuild = true;
						errormsg = 'BUILDING_ERROR_ENERGY';
					}
				}

			Planet.enoughtPeople(newData, fleetReturned, function(newData,enoughtPeople) {
				if(!enoughtPeople) {
					BlockBuild = true;
					errormsg = 'BUILDING_ERROR_PEOPLE';
				}
				newData.Buildings[data.building]--; // Revert new building, it's not builded yet

				if(!BlockBuild) {
					// Research bonus
						if(Research.getResearch(userReturned,'cp_mecanisation') === -1) {
							timeSpeed += researchBonus.cp_mecanisation;
						}
						if(data.building>8) {
							if(Research.getResearch(userReturned,'cp_tracteur') === -1) {
								timeSpeed += researchBonus.cp_tracteur;
							}
							if(Research.getResearch(userReturned,'cp_materielTp') === -1) {
								timeSpeed += researchBonus.cp_materielTp;
							}
						}
						if(data.building > 8) { // Faster if shipyard have higher lvl
							cost.time *= (1-(buildLvlUnitBuildingSpeedBonus*newData.Buildings[7]));
						}

					// We consume resources
					newData.resources[2] -= cost.iron;
					newData.resources[3] -= cost.aluminium;
					newData.resources[4] -= cost.copper;
					newData.resources[5] -= cost.titanium;

					newData.nextBuildingTime = currTime+Math.round(cost.time*3600*1000/timeSpeed);
					newData.nextBuilding = data.building;

					Websocket.SendMessageToClient({ sid: data.sid, message: 'BUILD_OK'});
					log(data.username+' updated building '+data.building+' on planet ' + planetReturned.name + ' (' + planetReturned.address + ') to next level','success');

				} else { // We just update ressources
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
		db.fleet.find(planetIn.unitBuildingFleetID, function(fleetReturned) {
			let id = (planetIn.unitBuildingID.substr(0,14) === 'SHIP_WEP_MINES')?'000000000000000000000000':planetIn.unitBuildingID;
			db.unit.find(id, function(unitReturned) {
				if(planetIn.unitBuildingID.substr(0,14) === 'SHIP_WEP_MINES') {
					unitReturned = {};
					unitReturned._id = planetIn.unitBuildingID;
					unitReturned.shipType = 'SHIP_DEF';
					unitReturned.cost = shipCosts[planetIn.unitBuildingID];
					unitReturned.ownerId = user.id;
				}

				let unitCount = 0;
				let newFleet = fleetReturned.toJSON();

				let timeCost = unitReturned.cost[4]*3600*1000;
				timeCost *= (1-(buildLvlUnitBuildingSpeedBonus*planetIn.Buildings[7]));

				if(currTime>planetIn.unitBuildingEndTime) { // total add
					let restantDepuisSynchro = Math.ceil((planetIn.unitBuildingEndTime - planetIn.lastUnitUpdate)/timeCost);
					unitCount = restantDepuisSynchro;

					newFleet.inBuilding = false;

					Websocket.sendNotification(user.sid, 'unit', { unitName: unitReturned.name, unitCount: planetIn.unitBuildingCount });
				} else { // Partial add
				 	let restant = Math.ceil((planetIn.unitBuildingEndTime - currTime)/timeCost);
				 	let restantDepuisSynchro = Math.ceil((planetIn.unitBuildingEndTime - planetIn.lastUnitUpdate)/timeCost);
				 	unitCount = restantDepuisSynchro - restant;			 	
				}

				if(unitCount === 0) { return; } // Prevent some bugs
				
				if(unitCount > planetIn.unitBuildingCount) { // Ca ne devrait jamais arriver, dans le pire des cas la derniere update est la demande de construction
					unitCount = planetIn.unitBuildingCount;
				}

				let set = false;
				for(let i=0; i<newFleet.units.length; i++) {
					if(''+newFleet.units[i][0] === ''+planetIn.unitBuildingID) {
						newFleet.units[i][1] += unitCount;
						set=true;
						break;
					}
				}
				if(!set) {
					newFleet.units.push([planetIn.unitBuildingID,unitCount]);
				}

				let popCost = (unitReturned.cost[5]>1)?unitReturned.cost[5]:1;
				newFleet.points = parseFloat(newFleet.points) + parseFloat(unitCount * popCost) * pointsCoef.units;
				newFleet.points = '' + newFleet.points;

				db.fleet.update(newFleet, function() {
					Units.refresh(user);
					Fleet.refresh(planetIn._id,user.sid);
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
	static update(planetIn,user,fleetList) {
		let data = planetIn.toJSON();
		let currTime = Date.now();

		data.lastResourcesUpdate = currTime;

		// Update resources
		data.resources = Planet.UpdateResources(planetIn,user);
		// Update points
		data.points = Planet.calcPlanetPoints(planetIn);
		data.points += parseFloat(Planet.calcFleetPoints(fleetList));
		data.points = Math.round(data.points);

		// Update buildings
		if(currTime>data.nextBuildingTime && data.nextBuilding !== -1) {
			data.Buildings[data.nextBuilding]++;

			Websocket.sendNotification(user.sid, 'building', { building: data.nextBuilding, lvl: data.Buildings[data.nextBuilding] });

			data.nextBuildingTime = -1;
			data.nextBuilding = -1;
		}

		// Update units
		if(data.unitBuildingEndTime !== -1) {
			Planet.UpdateUnits(planetIn,user,currTime);
		}

		if(currTime>data.unitBuildingEndTime) {
			data.unitBuildingEndTime = -1;
			data.unitBuildingID = '-1';
			data.unitBuildingCount = -1;
			data.unitBuildingFleetID = db.Schema.Types.ObjectId('-1');
		}

		data.lastUnitUpdate = currTime;

		return data;
	}

	/**
	 * Gets the people count
	 *
	 * @param      {<type>}    planet    Planet data
	 * @param      {Function}  callback  Function needed to called back
	 */
	static getPeople(planetData, fleets, callback) {
		let buildings = planetData.Buildings;
		let prod = Math.round(habGen[0]*Math.pow(buildings[2],2) + habGen[1]*buildings[2] + habGen[2]);
		let cons = 0;

		// Buildings
		for(let i=0; i<14; i++) {
			if(buildings[i]===0) { continue; }
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
	 * Is there enought people on planet ?
	 *
	 * @param      {Object}  buildings  The buildings list
	 */
	static enoughtPeople(planetData, fleets, callback) {
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
			if(empty) { return; }

			let replace = [
				['<',''],
				['>',''],
				['/',''],
			];

			for(let i=0; i<replace.length; i++) {
				data.name = data.name.split(replace[i][0]).join(replace[i][1]);
			}

			log(data.username+' renamed its planet ' + planetReturned.name +' (' +data.planet+'), new name: '+data.name);

			Planet.sendPlanetDataToUser({data: {name: data.name}, planet: data.planet, id: data.id, sid: data.sid });

			let newPlanetData = planetReturned.toJSON();
			newPlanetData.name = data.name;

			db.planet.update(newPlanetData);
		});
	}
	/**
	 * Calculates the resources.
	 *
	 * @class      CalcResources (name)
	 * @param      {<type>}  dataIn  Input planet data
	 */
	static UpdateResources(dataIn,user) {
		let Dtime = Date.now()-dataIn.nextBuildingTime;
		let resources = dataIn.resources;

		if(Dtime<0 || dataIn.nextBuildingTime===-1) { // Cas ou aucun bâtiment est en construction ou quand le bâtiment n'est pas encore fini
			resources = Planet.CalcNewResources(resources,dataIn.Buildings,dataIn.planetType,(Date.now()-dataIn.lastResourcesUpdate),user,dataIn.nextBuilding);
		} else {
			// Calcul avec les anciens bâtiments jusqu'a l'update
			resources = Planet.CalcNewResources(resources,dataIn.Buildings,dataIn.planetType,(dataIn.nextBuildingTime-dataIn.lastResourcesUpdate),user,dataIn.nextBuilding);
			// Calcul avec les nouveaux bâtiments
			resources = Planet.CalcNewResources(resources,dataIn.Buildings,dataIn.planetType,Dtime,user,dataIn.nextBuilding);
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
};