module.exports = class planet {
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
					var longueur = userReturned.planetlist.length;
					var valid = false;

					for(var i=0; i<longueur; i++) {
						if(pid==userReturned.planetlist[i]) { // Cas où le joueur a les bonnes infos
						    if(i==0 && decalage < 0) {
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
			planet.find(data,data.pid,decalage,function(planetReturned,userReturned,fleetReturned) {

				var newData = planet.update(planetReturned,userReturned,fleetReturned);

				db.planet.update(newData);

				units.refreshFleets(newData._id,data.sid);+

				sendPlanetDataToUser({data: newData, id: data.id, sid: data.sid });
			});
		}
		/**
		 * Send planet data to user
		 *
		 * @param      {<type>}  data    data
		 */
		static sendPlanetDataToUser(data) {
			data.sNow = Date.now();
			io.to(data.sid).emit("planet-recieve-data", data );
		}
		/**
		 * Gets the minerals ratio.
		 *
		 * @class      GetMineralsRatio (name)
		 * @param      {<type>}  type    The type of planet
		 * @return     {Object}  The minerals ratio.
		 */
		static GetMineralsRatio(type) {
			if(planetRatios[type]!=undefined) {
				return planetRatios[type];	
			} else {
				return planetRatios[0];
			}
		}
		/**
		 * Calculates the new resources based on constants building level on a
		 * specific time period.
		 *
		 * @class      CalcNewResources (resources)
		 * @param      {<type>}  resources   The old resources
		 * @param      {number}  buildings   The buildings levels
		 * @param      {<type>}  planetType  The planet type
		 * @param      {number}  time        The time period
		 * @param      {<type>}  user        The user
		 */
		static CalcNewResources(resources,buildings,planetType,time,user,currentBuilding) {
			time = time/3600/1000; // Passage en heures
			
			var oldResources = resources;

			var ratio = planet.GetMineralsRatio(planetType);
			var ratios = [ratio.ironRatio,ratio.aluRatio,ratio.copperRatio,ratio.titanRatio];

			var mineralProdBase = mineralProd[0]*Math.pow(buildings[0],2) - mineralProd[1]*buildings[0] + mineralProd[2];
			var metalProdBase   = metalProd[0]*Math.pow(buildings[1],2)   - metalProd[1]*buildings[1]   + metalProd[2];
			var heliumProdBase  = heliumProd[0]*Math.pow(buildings[13],2)  - heliumProd[1]*buildings[13]  + heliumProd[2];

			var warehouseBase = storageRatio[0]*Math.log(buildings[5]) + storageRatio[1];

			var mineralStorageBase = (mineralProd[0]*Math.pow(buildings[5],2) - mineralProd[1]*buildings[5] + mineralProd[2])*warehouseBase;
			var metalsStorageBase  = (metalProd[0]*Math.pow(buildings[5],2)   - metalProd[1]*buildings[5]   + metalProd[2]  )*warehouseBase;

			if(buildings[10]!=0) {
				var storageHelium = (heliumProd[0]*Math.pow(buildings[10],2)  - heliumProd[1]*buildings[10]  + heliumProd[2])*(storageRatio[0]*Math.log(buildings[10]) + storageRatio[1])*heliumStorageRatio; // Helium 3
			} else {
				var storageHelium = 0;
			}

			// Molecular compression, enhance max storage
			if(research.getResearch(user,"cp_molecular_compression")==-1) {
				mineralStorageBase *= researchBonus["cp_molecular_compression"];
				metalsStorageBase *= researchBonus["cp_molecular_compression"];
				storageHelium *= researchBonus["cp_molecular_compression"];
			}

			//Minerals
			if(currentBuilding!=0) {
				resources[0] += mineralProdBase*time;
			}

			//Helium 3
			if(buildings[13]!=0 && currentBuilding!=13) { resources[1] += heliumProdBase*time; }

			//Metals
			if(resources[0]-(metalProdBase*time)>0 && currentBuilding!=1) { //Verify if you can use basic ressources
			    for(var i=2; i<6; i++) {
			    	resources[i] += (metalProdBase*time)*ratios[i-2];
			    }

				resources[0] -= (metalProdBase*time); //Consomation Algorithm
			} else { // Do the max we can
			    for(var i=2; i<6; i++) {
			    	resources[i] += resources[0]*ratios[i-2];
			    }

				resources[0] = 0;
			}

			// Si Max de tout les metaux
			if((resources[5]>metalsStorageBase*ratio.titanRatio) && 
				(resources[4]>metalsStorageBase*ratio.copperRatio) && 
				(resources[3]>metalsStorageBase*ratio.aluRatio) && 
				(resources[2]>metalsStorageBase*ratio.ironRatio)) {

				var min = (resources[2] - metalsStorageBase*ratios[0])/ratios[0];

				for(var i=3; i<6; i++) {
					var temp = (resources[i] - metalsStorageBase*ratios[i-2])/ratios[i-2];

					if(temp<min) {
						min = temp;
					}
				}
				resources[0]+=min
			    for(var i=2; i<6; i++) {
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
		    for(var i=2; i<6; i++) {
		    	if(resources[i]>metalsStorageBase*ratios[i-2]) { // You can't have more iron than your storage capacity
					resources[i] = metalsStorageBase*ratios[i-2];
				}
		    }

			return resources
		}
		/**
		 * Do we can upgrade a building ? And if yes build it !
		 *
		 * @class      TryBuilding (name)
		 * @param      {<type>}  data    data
		 */
		static planetBuild(data) {
			// Mauvais n° de batiment
			if(data.building>14||data.building<0) { return; } // Stop Executing, it may create bugs
			planet.find(data,data.planet,0,function(planetReturned,userReturned,fleetReturned) {
				if(data.planet!=planetReturned.id) { // Stop if not belonging
					SendMessageToClient({ sid: data.sid, message: "ERROR_NOT_BELONGING" })
					log(data.username+' failed to update his building ('+data.building+') on planet ' + planetReturned.name + ' (' +data.planet+') to next level because he doesn\'t own it !',"fail");
					return;
				} 

				var timeSpeed = 1;

				var currTime = Date.now();

				// Calc new planet data
				var newData = planet.update(planetReturned,userReturned,fleetReturned);

				// Vars for this building test
				var cost = GetBuildingCost(data.building,newData.Buildings[data.building]+1);
				var BlockBuild = false;
				var errormsg = "BUILD_ERROR"; // Message d'erreur par defaut
					// Cost verif
					if(cost.iron>newData.resources[2] || cost.aluminium>newData.resources[3] || cost.copper>newData.resources[4] || cost.titanium>newData.resources[5] ) {
						BlockBuild = true;
						errormsg = "BUILDING_ERROR_COST";
					}
					// Un bâtiment est déja en construction ?
					if(newData.nextBuildingTime>currTime) { 
						BlockBuild = true; 
						errormsg = "BUILDING_ERROR_ALREADY";
					}
					// Niveau maximum ?
					if(newData.Buildings[data.building]>buildingMaxLvl[data.building]) {
						BlockBuild = true;
						errormsg = "BUILDING_ERROR_MAXIMUM";
					}

					newData.Buildings[data.building]++; // Only for calcs

					// Energie ? Habitants ?
					if(!BlockBuild) {	
						if(!enoughtEnergy(newData.Buildings) && data.building<=9 && data.building!=4) { // Only ground buildings affected by this
							BlockBuild = true;
							errormsg = "BUILDING_ERROR_ENERGY";
						}
					}

				enoughtPeople(newData, fleetReturned, function(newData,enoughtPeople) {
					if(!enoughtPeople) {
						BlockBuild = true;
						errormsg = "BUILDING_ERROR_PEOPLE";
					}
					newData.Buildings[data.building]--; // Revert new building, it's not builded yet

					if(!BlockBuild) {
						// Research bonus
							if(research.getResearch(userReturned,"cp_mecanisation") == -1) {
								timeSpeed += researchBonus.cp_mecanisation;
							}
							if(data.building>8) {
								if(research.getResearch(userReturned,"cp_tracteur") == -1) {
									timeSpeed += researchBonus.cp_tracteur;
								}
								if(research.getResearch(userReturned,"cp_materielTp") == -1) {
									timeSpeed += researchBonus.cp_materielTp;
								}
							}

						// We consume resources
						newData.resources[2] -= eval(cost.iron);
						newData.resources[3] -= eval(cost.aluminium);
						newData.resources[4] -= eval(cost.copper);
						newData.resources[5] -= eval(cost.titanium);

						newData.nextBuildingTime = currTime+Math.round(cost.time*3600*1000/timeSpeed);	
						newData.nextBuilding = data.building;

						SendMessageToClient({ sid: data.sid, message: "BUILD_OK"});
						log(data.username+' updated building '+data.building+' on planet ' + planetReturned.name + ' (' +data.planet+') to next level',"success");

					} else { // We just update ressources
						SendMessageToClient({ sid: data.sid, message: errormsg })
						log(data.username+' failed to update building '+data.building+' on planet ' + planetReturned.name + ' (' +data.planet+') to next level ' + errormsg,"fail");
					}

					db.planet.update(newData);

					sendPlanetDataToUser({data: newData, planet: data.planet, id: data.id, sid: data.sid }); 
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
				db.unit.find(planetIn.unitBuildingID, function(unitReturned) {
					var unitCount = 0;

					if(currTime>planetIn.unitBuildingEndTime) { // total add
						var restantDepuisSynchro = Math.floor((planetIn.unitBuildingEndTime - planetIn.lastUnitUpdate)/(unitReturned.cost[4]*3600*1000));
						unitCount = restantDepuisSynchro;
					} else { // Partial add
					 	var restant = Math.floor((planetIn.unitBuildingEndTime - currTime)/(unitReturned.cost[4]*3600*1000));
					 	var restantDepuisSynchro = Math.floor((planetIn.unitBuildingEndTime - planetIn.lastUnitUpdate)/(unitReturned.cost[4]*3600*1000));
					 	unitCount = restantDepuisSynchro - restant;				 	
					}

					if(unitCount == 0) { return; } // Prevent some bugs

					if(unitCount > planetIn.unitBuildingCount) { // Ca ne devrait jamais arriver, etant donne que dans le pire des cas la derniere update date de la demande de construction, mais c'est ici par sécurité
						unitCount = planetIn.unitBuildingCount;
					}

					var newFleet = fleetReturned.toJSON();
					var set = false;

					for(var i=0; i<newFleet.units.length; i++) {
						if(""+newFleet.units[i][0] == ""+planetIn.unitBuildingID) {
							newFleet.units[i][1] += unitCount;
							set=true;
							break;
						}
					}

					if(!set) {
						newFleet.units.push([planetIn.unitBuildingID,unitCount]);
					}

					var popCost = (unitReturned.cost[5]>1)?unitReturned.cost[5]:1;
					newFleet.points = parseFloat(newFleet.points) + parseFloat(unitCount * popCost) * pointsCoef['units'];
					newFleet.points = "" + newFleet.points;

					db.fleet.update(newFleet, function() {
						units.refreshUnits(user);
						units.refreshFleets(planetIn._id,user.sid);
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
			var data = planetIn.toJSON();
			var currTime = Date.now();

			data.lastResourcesUpdate = currTime;

			// Update resources
			data.resources = planet.UpdateResources(planetIn,user);
			// Update points
			data.points = planet.calcPlanetPoints(planetIn);
			data.points += parseFloat(calcFleetPoints(fleetList));
			data.points = Math.round(data.points);

			// Update buildings
			if(currTime>data.nextBuildingTime && data.nextBuilding != -1) {
				data.Buildings[data.nextBuilding]++;
				data.nextBuildingTime = -1;
				data.nextBuilding = -1;
			}

			// Update units
			if(data.unitBuildingEndTime != -1) {
				planet.UpdateUnits(planetIn,user,currTime);
			}

			if(currTime>data.unitBuildingEndTime) {
				data.unitBuildingEndTime = -1;
				data.unitBuildingID = db.Schema.Types.ObjectId("-1");
				data.unitBuildingCount = -1;
				data.unitBuildingFleetID = db.Schema.Types.ObjectId("-1");
			}

			data.lastUnitUpdate = currTime;

			return data;
		}
		/**
		 * Is there enought energy on planet ?
		 *
		 * @param      {Object}  groundBuildings  The ground buildings list
		 */
		static enoughtEnergy(groundBuildings) {
			var prod = Math.round(electricity[0]*Math.pow(groundBuildings[4],2) + electricity[1]*groundBuildings[4] + electricity[2]);
			var cons = 0;

			for(var i=0; i<9; i++) {
				cons += parseInt(GetBuildingCost(i,groundBuildings[i]).energy);
			}

			if(prod<cons) {
				return false;
			}
			return true;
		}

		/**
		 * Gets the people count
		 *
		 * @param      {<type>}    planet    Planet data
		 * @param      {Function}  callback  Function needed to called back
		 */
		static getPeople(planet, fleets, callback) {
			var buildings = planet.Buildings;
			var prod = Math.round(habGen[0]*Math.pow(buildings[2],2) + habGen[1]*buildings[2] + habGen[2]);
			var cons = 0;

			// Buildings
			for(var i=0; i<14; i++) {
				if(buildings[i]==0) { continue; }
				if(i==planet.nextBuilding) {
					// Current in-build building
					cons += parseInt(GetBuildingCost(i,buildings[i] + 1).habitants);
					continue; 
				}
				cons += parseInt(GetBuildingCost(i,buildings[i]).habitants);
			}

			// Units builded and in-build
			for(var i=0; i<fleets.length; i++) {
				cons += fleets[i].population;
			}

			callback(planet,prod,cons);
		}

		/**
		 * Is there enought people on planet ?
		 *
		 * @param      {Object}  buildings  The buildings list
		 */
		static enoughtPeople(planet, fleets, callback) {
			getPeople(planet, fleets, function(planet, prod, cons) {
				if(prod<cons) {
					callback(planet,false);
				}
				callback(planet,true);
			});
		}
		/**
		 * Change the planet name
		 *
		 * @class      rename (name)
		 * @param      {<type>}  data    data
		 */
		static rename(data) {
			planet.find(data,data.planet,0,function(planetReturned,userReturned,fleetReturned) {
				if(data.planet!=planetReturned.id) { // Stop if not belonging
					SendMessageToClient({ sid: data.sid, message: "ERROR_NOT_BELONGING" })
					log(data.username+' failed to change name  on planet ' + planetReturned.name + ' (' +data.planet+') he doesn\'t own it !',"fail");
					return;
				}

				// Planetes sans nom ...
				var empty = true;
				for(var i=0; i<data.name.length; i++) {
					if(data.name[i]!=" ") {
						empty = false
					 	break;
					}
				}	
				if(empty) { return; }

				var replace = [
					['<',''],
					['>',''],
					['/',''],
				];

				for(var i=0; i<replace.length; i++) {
					data.name = data.name.split(replace[i][0]).join(replace[i][1])
				}

				log(data.username+' renamed its planet ' + planetReturned.name +' (' +data.planet+'), new name: '+data.name);

				var newPlanetData = {};
				newPlanetData.name = data.name;

				sendPlanetDataToUser({data: newPlanetData, planet: data.planet, id: data.id, sid: data.sid });

				var newPlanetData = planetReturned.toJSON();
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
			var Dtime = Date.now()-dataIn.nextBuildingTime;
			var resources = dataIn.resources;

			if(Dtime<0 || dataIn.nextBuildingTime==-1) { // Cas ou aucun bâtiment est en construction ou quand le bâtiment n'est pas encore fini
				resources = planet.CalcNewResources(resources,dataIn.Buildings,dataIn.planetType,(Date.now()-dataIn.lastResourcesUpdate),user,dataIn.nextBuilding);
			} else {
				// Calcul avec les anciens bâtiments jusqu'a l'update
				resources = planet.CalcNewResources(resources,dataIn.Buildings,dataIn.planetType,(dataIn.nextBuildingTime-dataIn.lastResourcesUpdate),user,dataIn.nextBuilding);
				// Calcul avec les nouveaux bâtiments
				resources = planet.CalcNewResources(resources,dataIn.Buildings,dataIn.planetType,Dtime,user,dataIn.nextBuilding);
			}

			return resources
		}

		static calcPlanetPoints(dataIn) {
			var points = 0;

			// Building points count
			for(var i=0; i<globalConst["buildingNumber"]; i++) {
				points += (dataIn.Buildings[i] * buildingPointCoef[i]);
			}

			return points
		}

		static calcFleetPoints(fleets) {
			var points = 0;

			// Building points count
			for(var i=0; i<fleets.length; i++) {
				points += parseFloat(fleets[i].points);
			}

			return points;
		}

		/**
		 * Gets the building cost.
		 *
		 * @class      GetBuildingCost (name)
		 * @param      {<type>}  build   The building id
		 * @param      {number}  level   The level asked
		 * @return     {<type>}  The building cost.
		 */
		static GetBuildingCost(build,level) {
			if(build < 0 || build > globalConst["buildingNumber"]) { return; }

			var retour = {
				aluminium: 	Math.round(buildCost["aluminium"][build][0]*Math.pow(level,2) +		buildCost["aluminium"][build][1]*level + 	buildCost["aluminium"][build][2]),
				iron: 		Math.round(buildCost["iron"][build][0]*Math.pow(level,2) +			buildCost["iron"][build][1]*level + 		buildCost["iron"][build][2]),
				copper: 	Math.round(buildCost["copper"][build][0]*Math.pow(level,2) + 		buildCost["copper"][build][1]*level + 		buildCost["copper"][build][2]),
				titanium: 	Math.round(buildCost["titanium"][build][0]*Math.pow(level,2) + 		buildCost["titanium"][build][1]*level + 	buildCost["titanium"][build][2]),
				time: 				   buildCost["time"][build][0]*Math.pow(level,2) + 			buildCost["time"][build][1]*level + 		buildCost["time"][build][2],
				energy: 	Math.round(Math.pow(buildCost["energy"][build][0]*level,2) + 		buildCost["energy"][build][1]*level + 		buildCost["energy"][build][2]),
				energy_difference: Math.round(Math.pow(buildCost["energy"][build][0]*level,2) + buildCost["energy"][build][1]*level +       buildCost["energy"][build][2] 
				                        - (Math.pow(buildCost["energy"][build][0]*(level-1),2) + buildCost["energy"][build][1]*(level-1) +   buildCost["energy"][build][2])),
				habitants:  Math.round(buildCost["habitants"][build][0]*Math.pow(level,2) +		buildCost["habitants"][build][1]*level + 	buildCost["habitants"][build][2]),
				habitants_difference: Math.round(buildCost["habitants"][build][0]*Math.pow(level,2) +	buildCost["habitants"][build][1]*level + 	buildCost["habitants"][build][2]
					                         - (buildCost["habitants"][build][0]*Math.pow((level-1),2) +	buildCost["habitants"][build][1]*(level-1) + buildCost["habitants"][build][2])),
			};

			if(level == 1) {
				retour.habitants_difference = retour.habitants;
				retour.energy_difference = retour.energy;
			}

			return retour;
		}
}