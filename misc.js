module.exports = function() {    
	/* 
	getDateTime
	Get exact date and time
	IN: -
	OUT: date(string) 
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
	/*
	isset
	INPUT: variable
	OUTPUT: defined ( bool )
	*/
	this.isset = function(variable) {
		if(typeof variable !== 'undefined' && variable !== undefined && variable != null && variable != {} && variable != "") {
			return true;
		} else {
			return false;
		}
	}
};