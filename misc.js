module.exports = function() {    
	/**
	 * Gets the date time.
	 *
	 * @return     {string}  The date time.
	 */
	this.getDateTime = function () {
	    var date = new Date();

	    var hour = date.getHours();
	    hour = (hour < 10 ? "0" : "") + hour;

	    var min  = date.getMinutes();
	    min = (min < 10 ? "0" : "") + min;

	    var sec  = date.getSeconds();
	    sec = (sec < 10 ? "0" : "") + sec;

	    var year = date.getFullYear();

	    var month = date.getMonth() + 1;
	    month = (month < 10 ? "0" : "") + month;

	    var day  = date.getDate();
	    day = (day < 10 ? "0" : "") + day;

		return day + "/" + month + "/" + year + " " + hour + ":" + min + ":" + sec;
	};
	/**
	 * { function_description }
	 *
	 * @param      {(number|string)}  variable  The variable to test
	 * @return     {boolean}          the variable is set
	 */
	this.isset = function(variable) {
		if(variable===0 || (typeof variable !== 'undefined' && variable !== undefined && variable != null && variable != {} && variable != "")) {
			return true;
		} else {
			return false;
		}
	}
};