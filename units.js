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
		}
}