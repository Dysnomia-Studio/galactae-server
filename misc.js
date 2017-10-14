var charList = [
    // a    
    ["à","&agrave;"],
    ["á","&aacute;"],
    ["â","&acirc;"],
    ["ã","&atilde;"],
    ["ä","&auml;"],
    ["å","&aring;"],
    ["æ","&aelig;"],
    // c
    ["ç","&ccedil;"],
    // e        
    ["è","&egrave;"],
    ["é","&eacute;"],
    ["ê","&ecirc;"],
    ["ë","&euml;"],
    // i
    ["ì","&igrave;"],
    ["í","&iacute;"],
    ["î","&icirc;"],
    ["ï","&iuml;"], 
    // n
    ["ñ","&ntilde;"],
    // o
    ["ò","&ograve;"],
    ["ó","&oacute;"],
    ["ô","&ocirc;"],
    ["õ","&otilde;"],
    ["ö","&ouml;"],
    // u
    ["ù","&ugrave;"],
    ["ú","&uacute;"],
    ["û","&ucirc;"],
    ["ü","&uuml;"],
    // y
    ["ý","&yacute;"],
    ["ÿ","&yuml;"],
    //math
    ["÷","&divide;"],
    ["×","&times;"],
    ["±","&plusmn;"],
    ["¼","&frac14;"],
    ["½","&frac12;"],
    ["¾","&frac34;"],
    ["¹","&sup1;"],
    ["²","&sup2;"],
    ["³","&sup3;"],
    // others
    ["€","&euro;"],
    ["¢","&cent;"],
    ["£","&pound;"],
    ["ß","&szlig;"],
    ["¿","&iquest;"],
    ["µ","&micro;"],
    ["©","&copy;"],
    ["°","&deg;"],
    ["¨","&uml;"],
    ["§","&sect;"],
    ["¤","&curren;"],
    ["¦","&brvbar;"],
];


var smileys = [
    [":D","😃"],
    [":-D","😃"],

    ["xD","😆"],
    ["XD","😆"],
    ["xd","😆"],
    ["Xd","😆"],

    ["X(","😣"],
    ["x(","😣"],

    ["XP","😝"],
    ["Xp","😝"],
    ["xP","😝"],
    ["xp","😝"],

    [":p","😛"],
    [":P","😛"],

    [";)","😉"],
    [";D","😉"],

    [":)","🙂"],

    [":(","🙁"],

    ["^^","😄"],

    ["<3","😍"],
];

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
	 * Check if a variable is set
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
	/**
	 * Normalize a text to be compatible with sockets
	 *
	 * @param      {<type>}  str     The string
	 * @return     {<type>}  normalized string
	 */
	this.normalizeText = function(str) {
	    for(var i=0; i<charList.length; i++) {
	    	str = str.split(charList[i][0]).join(charList[i][1]);
	    }

		return str;
	}
	this.unNormalizeText = function(str) {
	    for(var i=0; i<charList.length; i++) {
	        str = str.split(charList[i][1]).join(charList[i][0]);
	    }

	    return str;
	}

    this.textToSmileys = function(str) {
        for(var i=0; i<smileys.length; i++) {
            str = str.split(smileys[i][0]).join(smileys[i][1]);
        }

        return str;
    }
};