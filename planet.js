var db = require('./database');
require('./calcConstants')();

module.exports = function() {
		/**
		 * Gets the planet information.
		 *
		 * @param      {object}    user      User who asks for
		 * @param      {string}    pid       Planet ID
		 * @param      {number}    decalage  decalage de n°
		 * @param      {Function}  callback  Function needed to call back
		 */
		this.getPlanet = function(user,pid,decalage,callback) {
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
						callback(planetReturned,userReturned);
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
		this.refreshUserPlanet = function(data,decalage=0) {
			getPlanet(data,data.pid,decalage,function(planetReturned,userReturned) {

				var newData = UpdatePlanet(planetReturned,userReturned);

				db.planet.update(newData);

				sendPlanetDataToUser({data: newData, id: data.id, sid: data.sid });
			});
		}
		/**
		 * Send planet data to user
		 *
		 * @param      {<type>}  data    data
		 */
		this.sendPlanetDataToUser = function(data) {
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
		this.GetMineralsRatio = function(type) {
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
		this.CalcNewResources = function(resources,buildings,planetType,time,user,currentBuilding) {
			time = time/3600/1000; // Passage en heures
			
			var oldResources = resources;

			var ratio = GetMineralsRatio(planetType);
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

			//Minerals
			if(currentBuilding!=0) {
				resources[0] += mineralProdBase*time;
			}

			//Helium 3
			if(buildings[13]!=0 && currentBuilding!=13) { resources[1] += heliumProdBase*time; }

			//Metals
			if(resources[0]-(mineralProdBase*time)>0 && currentBuilding!=1) { //Verify if you can use basic ressources
			    for(var i=2; i<6; i++) {
			    	resources[i] += (metalProdBase*time)*ratios[i-2];
			    }

				resources[0] -= (mineralProdBase*time); //Consomation Algorithm
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
		this.planetBuild = function(data) {
			// Mauvais n° de batiment
			if(data.building>14||data.building<0) { return; } // Stop Executing, it may create bugs
			getPlanet(data,data.planet,0,function(planetReturned,userReturned) {
				if(data.planet!=planetReturned.id) { // Stop if not belonging
					SendMessageToClient({ sid: data.sid, message: "ERROR_NOT_BELONGING" })
					log(data.username+' failed to update his building ('+data.building+') on planet ' + planetReturned.name + ' (' +data.planet+') to next level because he doesn\'t own it !',"fail");
					return;
				} 

				var timeSpeed = 1;


				var currTime = Date.now();

				// Calc new planet data
				var newData = UpdatePlanet(planetReturned,userReturned);

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
					// Energie ?
					if(!enoughtEnergy(newData.Buildings)&&data.building<=9) { // Only ground buildings affected by this
						BlockBuild = true;
						errormsg = "BUILDING_ERROR_ENERGY";
					}

				// Research bonus
					if(getResearch(userReturned,"cp_mecanisation") == -1) {
						timeSpeed += researchBonus.cp_mecanisation;
					}
					if(data.building>8) {
						if(getResearch(userReturned,"cp_tracteur") == -1) {
							timeSpeed += researchBonus.cp_tracteur;
						}
						if(getResearch(userReturned,"cp_materielTp") == -1) {
							timeSpeed += researchBonus.cp_materielTp;
						}
					}

				if(!BlockBuild) {
					// We consume resources
					newData.resources[2] -= eval(cost.iron);
					newData.resources[3] -= eval(cost.aluminium);
					newData.resources[4] -= eval(cost.copper);
					newData.resources[5] -= eval(cost.titanium);

					newData.nextBuildingTime = currTime+Math.round(cost.time*3600*1000);	
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
		}
		/**
		 * Update the planet data
		 *
		 * @class      UpdatePlanet (name)
		 * @param      {<type>}  planetIn 	 data needed to be updated
		 * @return     {<type>}        		 the updated data
		 */
		this.UpdatePlanet = function(planetIn,user) {
			var data = planetIn.toJSON();
			var currTime = Date.now();

			data.lastResourcesUpdate = currTime;

			// Update resources
			data.resources = UpdateResources(planetIn,user);
			// Update points
			data.points = calcPlanetPoints(planetIn);

			// Update buildings
			if(currTime>data.nextBuildingTime && data.nextBuilding != -1) {
				data.Buildings[data.nextBuilding]++;
				data.nextBuildingTime = -1;
				data.nextBuilding = -1;
			}

			return data;
		}
		/**
		 * Is there enought energy on planet ?
		 *
		 * @param      {Object}  groundBuildings  The ground buildings
		 */
		this.enoughtEnergy = function(groundBuildings) {
			var prod = Math.round(2080000*Math.pow(groundBuildings[4],2) + 165000*groundBuildings[4] + 550000);
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
		 * Change the planet name
		 *
		 * @class      ChangePlanetName (name)
		 * @param      {<type>}  data    data
		 */
		this.ChangePlanetName = function(data) {
			getPlanet(data,data.planet,0,function(planetReturned,userReturned) {
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
		this.UpdateResources = function(dataIn,user) {
			var Dtime = Date.now()-dataIn.nextBuildingTime;
			var resources = dataIn.resources;

			if(Dtime<0 || dataIn.nextBuildingTime==-1) { // Cas ou aucun bâtiment est en construction ou quand le bâtiment n'est pas encore fini
				resources = CalcNewResources(resources,dataIn.Buildings,dataIn.planetType,(Date.now()-dataIn.lastResourcesUpdate),user,dataIn.nextBuilding);
			} else {
				// Calcul avec les anciens bâtiments jusqu'a l'update
				resources = CalcNewResources(resources,dataIn.Buildings,dataIn.planetType,(dataIn.nextBuildingTime-dataIn.lastResourcesUpdate),user,dataIn.nextBuilding);
				// Calcul avec les nouveaux bâtiments
				resources = CalcNewResources(resources,dataIn.Buildings,dataIn.planetType,Dtime,user,dataIn.nextBuilding);
			}

			return resources
		}

		this.calcPlanetPoints = function(dataIn) {
			var points = 0;

			// Building points count
			for(var i=0; i<globalConst["buildingNumber"]; i++) {
				points += (dataIn.Buildings[i] * buildingPointCoef[i]);
			}

			return points
		}
		/**
		 * Gets the building cost.
		 *
		 * @class      GetBuildingCost (name)
		 * @param      {<type>}  build   The building id
		 * @param      {number}  level   The level asked
		 * @return     {<type>}  The building cost.
		 */
		this.GetBuildingCost = function(build,level) {
			if(build < 0 || build > globalConst["buildingNumber"]) { return; }

			return {
				aluminium: 	Math.round(buildCost["aluminium"][build][0]*Math.pow(level,2) +		buildCost["aluminium"][build][1]*level + 	buildCost["aluminium"][build][2]),
				iron: 		Math.round(buildCost["iron"][build][0]*Math.pow(level,2) +			buildCost["iron"][build][1]*level + 		buildCost["iron"][build][2]),
				copper: 	Math.round(buildCost["copper"][build][0]*Math.pow(level,2) + 		buildCost["copper"][build][1]*level + 		buildCost["copper"][build][2]),
				titanium: 	Math.round(buildCost["titanium"][build][0]*Math.pow(level,2) + 		buildCost["titanium"][build][1]*level + 	buildCost["titanium"][build][2]),
				time: 				   buildCost["time"][build][0]*Math.pow(level,2) + 			buildCost["time"][build][1]*level + 		buildCost["time"][build][2],
				energy: 	Math.round(Math.pow(buildCost["energy"][build][0]*level,2) + 		buildCost["energy"][build][1]*level + 		buildCost["energy"][build][2]),
				energy_difference: 	Math.round(Math.pow(buildCost["energy"][build][0]*level,2) + buildCost["energy"][build][1]*level + buildCost["energy"][build][2]) - Math.round(Math.pow(buildCost["energy"][build][0]*(level-1),2) + buildCost["energy"][build][1]*(level-1) + buildCost["energy"][build][2])
			}
		}
}