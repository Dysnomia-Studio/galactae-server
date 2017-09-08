var db = require('./database');

module.exports = function() {
		/**
		 * Get and send unit data to user
		 *
		 * @param      {object}  data    user data
		 * @return     {socket}  units   list of units types
		 */
		this.refreshUserUnits = function(data) {
			db.unit.findByOwner(data.id,function(units) {
				if(units==undefined) { units = []; }
				io.to(data.sid).emit("units-recieve-data", units);
			});
		},

		/**
		 * Creates an unit type.
		 *
		 * @class      CreateUnitType (name)
		 * @param      {<type>}  data    Data given by client
		 */
		this.CreateUnitType = function(data) {
			var errors = 0;
			var errorMessage = "";
			var ship = data.ship;

			// Check entries valdity
			for(var i in ship) {
				// Empty fields
				if(i=="name" || i=="type" || i=="shape") {
					if(ship[i]==undefined || ship[i].split(' ').join('')=="") {
						errors ++;
						message = "SHIP_HAS_NO_NAME";
						break;
					} 
				} else {
					if(ship[i].value==undefined || ship[i].value.split(' ').join('')=="" || ship[i].type==undefined || ship[i].type.split(' ').join('')=="") {
						errors ++;
						message = "SHIP_HAS_EMPTY_FIELD";
						break;
					} 
				}
			}

			// Wrong type/shape
			if(shipShapesDetails[ship.type]==undefined || shipShapesDetails[ship.type][ship.shape]==undefined) {
				errors ++;
				message = "SHIP_HAS_WRONG_TYPE_OR_SHAPE";
			}

			if(errors==0) {
				for(var i in ship) {
					if(i=="name" || i=="type" || i=="shape") { continue; }
					// Check if that kind of part exists in that kind of ship
					var valid = false;
					for(var type in shipShapesDetails[ship.type][ship.shape]['content']) {
						if(type==ship[i].type) {
							valid = true;
							break;
						}
					}

					// Check if that part exists in that kind of ship
					if(valid) {
						valid = false;
						for(var j=0; shipShapesDetails[ship.type][ship.shape]['svg'].length; j++) {
							if(shipShapesDetails[ship.type][ship.shape]['svg'][j][6]==i) {
								valid = true;
								break;
							}
						}
					}

					// Check if technology exists in that kind of ship
					if(valid) {
						valid = false;
						for(var j=0; shipShapesDetails[ship.type][ship.shape]['content'][ship[i].type].length; j++) {
							if(shipShapesDetails[ship.type][ship.shape]['content'][ship[i].type][j]==ship[i].value) {
								valid = true;
								break;
							}
						}
					}

					if(!valid) {
						errors++;
						message = "SHIP_HAS_INVALID_PARTS";
						break;
					}
				}
			}


			// Last check
			if(errors==0) {
				db.player.searchByName(data.username,function(userReturned) {
					// Check research
					for(var i in ship) {
						if(i=="name" || i=="type" || i=="shape") { continue; }

						if(getResearch(userReturned,shipResearchDependencies[ship[i].value]) !== -1) {
							errors++;
							message = "NEEDED_RESEARCH_MISSING";
							break;
						}
					}

					// Saving
					if(errors==0) {
						// Save to database
						var shipToSave = {
							name: ship.name,
							shipType: ship.type,
							shipShape: ship.shape,
							ownerId: data.id,
							inBuilding: [],
							parts: [],
							armorType: 0, // None yet 
						};

						for(var i in ship) {
							if(i=="name" || i=="type" || i=="shape") { continue; }
							
							shipToSave.parts.push({
								type: ship[i].type,
								name: i,
								tech: ship[i].value
							});
						}
					

						unit.create(shipToSave);

						// Notify client
						log(data.username + " has succed to create new unit type named " + ship.name,"success");
						refreshUserUnits(data);
					} else {
						// Notify client
						log(data.username + " has failed to create unit type named " + ship.name + " because " + message,"fail");
						SendMessageToClient({sid: data.sid, message: errorMessage});
					}
				});
			} else {
				// Notify client
				log(data.username + " has failed to create unit type named " + ship.name + " because " + message,"fail");
				SendMessageToClient({sid: data.sid, message: errorMessage});
			}
		}
}