/**
 * Libs
 */
global.assert = require('assert');

/**
 * My libs
 */
require('../calcConstants')();
require('../misc')();

global.Buildings    		= require('../Buildings');
global.Combat 				= require('../combat');
global.Chat 				= require('../chat');
global.DependencyEngine   	= require('../DependencyEngine');
global.Discord   			= require('../discord');
global.Fleets				= require('../Fleets');
global.GameMap   			= require('../GameMap');
global.Planet    			= require('../planet');
global.Player 				= require('../player');
global.Privileges 			= require('../privileges');
global.Reports 				= require('../Reports');
global.Research 			= require('../research');
global.Resources   			= require('../Resources');
global.Tactics    			= require('../tactics');
global.Tutorials 			= require('../Tutorials');
global.Units				= require('../Units');
global.Websocket 			= require('../socket');

global.log = (data) => console.log('\t > ' + data);


/**
 * DB & IO
 */
global.socketEvents = {};
global.SocketMngr = class SocketMngr {
	on(event, func) {
		socketEvents[event] = func;
	}
};

global.io = class io {
	static to() { return new io(); }
	emit() { return 0; }
	static on(event, func) {
		func(new SocketMngr());
	}
};

global.db = {
	ban: {},
	battleLog: {},
	battleLogAccess: { fetchByPlayer: () => {} },
	fleet: {},
	player: {},
	tactics: {},
	unit: {},
};

global.preventRestarts = 0;
