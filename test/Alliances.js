describe('• Alliances', () => {
	describe('# sendToPlayer()', () => {
		it('should work', () => {
			const allianceData = {
				id: 'MyId',
				name: 'name',
				description: 'description',
				members: [
					{ name: 'Elanis', founder: true, leader: false, diplomacy: false },
					{ name: 'Foo', founder: false, leader: false, diplomacy: false },
					{ name: 'Bar', founder: false, leader: true, diplomacy: false },
				],
			};

			db.alliance.getMembers = (allyId) => {
				return allianceData.members;
			};

			io.to = (sid) => {
				return {
					emit: (event, content) => {
						if(event === 'player-alliance-data') {
							assert.deepEqual(content, allianceData);
						}
					},
				};
			};

			Alliances.sendToPlayer({
				id: 'test',
				name: 'foo',
				ally: {
					id: 'MyId',
					name: 'name',
					description: 'description',
				},
				foo: 'bar'
			});
		});
	});

	describe('# hasFounderPermissions()', () => {
		it('Founder perms', async() => {
			db.alliance.getPermissions = () => { return { founder: true }; };

			assert(
				await Alliances.hasFounderPermissions({ })
			);
		});

		it('No perms', async() => {
			db.alliance.getPermissions = () => { return { }; };

			assert(
				!(await Alliances.hasFounderPermissions({ }))
			);
		});
	});

	describe('# hasLeaderPermissions()', () => {
		it('Founder perms', async() => {
			db.alliance.getPermissions = () => { return { founder: true }; };

			assert(
				await Alliances.hasLeaderPermissions({ })
			);
		});

		it('Leader perms', async() => {
			db.alliance.getPermissions = () => { return { leader: true }; };

			assert(
				await Alliances.hasLeaderPermissions({ })
			);
		});

		it('No perms', async() => {
			db.alliance.getPermissions = () => { return { }; };

			assert(
				!(await Alliances.hasLeaderPermissions({ }))
			);
		});
	});

	describe('# hasDiplomacyPermissions()', () => {
		it('Founder perms', async() => {
			db.alliance.getPermissions = () => { return { founder: true }; };

			assert(
				await Alliances.hasDiplomacyPermissions({ })
			);
		});

		it('Leader perms', async() => {
			db.alliance.getPermissions = () => { return { leader: true }; };

			assert(
				await Alliances.hasDiplomacyPermissions({ })
			);
		});

		it('Diplomacy perms', async() => {
			db.alliance.getPermissions = () => { return { diplomacy: true }; };

			assert(
				await Alliances.hasDiplomacyPermissions({ })
			);
		});

		it('No perms', async() => {
			db.alliance.getPermissions = () => { return { }; };

			assert(
				!(await Alliances.hasDiplomacyPermissions({ }))
			);
		});
	});

	describe('# search()', () => {
		db.alliance.search = (text) => {
			if(text === 'blah') {
				return [
					{ foo: 'bar' }
				];
			}

			return [];
		};

		it('should work', () => {
			io.to = (sid) => {
				return {
					emit: (event, content) => {
						if(event === 'player-search-results') {
							assert.deepEqual(content, [
								{ foo: 'bar' }
							]);
						}
					},
				};
			};

			Alliances.search('sid', 'blah');
		});

		it('should not work', () => {
			io.to = (sid) => {
				return {
					emit: (event, content) => {
						if(event === 'player-search-results') {
							assert.deepEqual(content, []);
						}
					},
				};
			};

			Alliances.search('sid', 'bleh');
		});
	});

	describe('create()', () => {
		it('ally = null', () => {
			let steps = 0;

			const allianceData = {
				id: 'MyId',
				name: 'name',
				description: 'description',
				members: [
					{ name: 'Elanis', founder: true, leader: false, diplomacy: false },
					{ name: 'Foo', founder: false, leader: false, diplomacy: false },
					{ name: 'Bar', founder: false, leader: true, diplomacy: false },
				],
			};

			const userData = {
				id: 'PlyId',
				name: 'PlyName',
				sid: 'sid',
				ally: null,
			};

			db.alliance.createPermissions = () => { steps++; };

			db.alliance.create = (obj) => {
				assert.equal(obj.name, allianceData.name);
				assert.equal(obj.description, allianceData.description);

				steps++;

				return allianceData.id;
			};

			db.player.updateAlly = (user) => {
				assert.equal(user.id, userData.id);
				assert.equal(user.ally, allianceData.id);

				steps++;
			};


			io.to = (sid) => {
				return {
					emit: (event, content) => {
						if(event === 'player-alliance-data') {
							assert.deepEqual(content, allianceData);
							assert.equal(steps, 3);
						}
					},
				};
			};

			Alliances.create(userData.sid, userData, allianceData.name, allianceData.description);
		});

		it('ally != null', () => {
			io.to = (sid) => {
				return {
					emit: (event, content) => {
						if(event === 'player-alliance-data') {
							assert(false);
						}
					},
				};
			};

			Alliances.create('sid', { ally: 'foo' }, 'name', 'description');
		});
	});

	describe('askToJoin()', () => {
		it('ally = null', () => {
			const playerId = 'plyId';
			const allianceId = 'allyId';

			db.alliance.askToJoin = (plyId, allyId) => {
				assert.equal(playerId, plyId);
				assert.equal(allianceId, allyId);
			};

			Alliances.askToJoin({ name: 'bar', ally: null }, playerId, allianceId);
		});

		it('ally != null', () => {
			const playerId = 'plyId';
			const allianceId = 'allyId';

			db.alliance.askToJoin = (plyId, allyId) => {
				assert(false);
			};

			Alliances.askToJoin({ name: 'bar', ally: 'foo' }, playerId, allianceId);
		});
	});

	describe('choiceAskToJoin()', () => {
		it('choice = true', () => {
			let steps = 0;
			const playerName = 'myPlayerName';
			const currPlayer = {
				ally: 'MyAllyId',
			};

			db.alliance.askedToJoin = () => {
				steps++;
				return true;
			};

			db.alliance.createPermissions = () => { steps++; };

			db.alliance.getPermissions = () => {
				steps++;

				return { founder: true };
			};

			db.player.findByName = (playerName) => {
				steps++;
				return {
					id: 'playerId',
				};
			};

			db.player.updateAlly = () => { steps++; };

			db.alliance.removeJoinAsk = () => { steps++; };

			db.alliance.find = () => {
				steps++;
				return {
					id: 'MyAllyId',
					name: 'MyAllyName',
					description: 'MyAllyDesc',
				};
			};

			io.to = (sid) => {
				return {
					emit: (event, content) => {
						if(event === 'player-alliance-data') {
							assert.equal(steps, 7);
						}
					},
				};
			};

			Alliances.choiceAskToJoin(currPlayer, playerName, true);
		});

		it('choice = false', () => {
			let steps = 0;
			const playerName = 'myPlayerName';
			const currPlayer = {
				ally: 'MyAllyId',
			};

			db.alliance.askedToJoin = () => {
				steps++;
				return true;
			};

			db.alliance.createPermissions = () => { steps++; };

			db.alliance.getPermissions = () => {
				steps++;

				return { leader: true };
			};

			db.player.findByName = (playerName) => {
				steps++;
				return {
					id: 'playerId',
				};
			};

			db.player.updateAlly = () => { steps++; };

			db.alliance.removeJoinAsk = () => { steps++; };

			db.alliance.find = () => {
				steps++;
				return {
					id: 'MyAllyId',
					name: 'MyAllyName',
					description: 'MyAllyDesc',
				};
			};

			io.to = (sid) => {
				return {
					emit: (event, content) => {
						if(event === 'player-alliance-data') {
							assert.equal(steps, 5);
						}
					},
				};
			};

			Alliances.choiceAskToJoin(currPlayer, playerName, false);
		});

		it('askedToJoin = false', () => {
			db.alliance.askedToJoin = () => {
				return false;
			};

			io.to = (sid) => {
				return {
					emit: (event, content) => {
						if(event === 'player-alliance-data') {
							assert(false);
						}
					},
				};
			};

			Alliances.choiceAskToJoin({}, 'ply', false);
		});

		it('no perms', () => {
			db.alliance.getPermissions = () => {
				return { leader: false, founder: false, diplomacy: false };
			};

			io.to = (sid) => {
				return {
					emit: (event, content) => {
						if(event === 'player-alliance-data') {
							assert(false);
						}
					},
				};
			};

			Alliances.choiceAskToJoin({}, 'ply', false);
		});
	});

	describe('invite()', () => {
		it('should work', () => {
			const playerId = 'plyId';
			const allianceId = 'allyId';

			db.alliance.getPermissions = () => {
				return { leader: true };
			};

			db.alliance.invite = (plyId, allyId) => {
				assert.equal(playerId, plyId);
				assert.equal(allianceId, allyId);
			};

			Alliances.invite({ name: 'plyName' }, playerId, allianceId);
		});

		it('no perms', () => {
			const playerId = 'plyId';
			const allianceId = 'allyId';

			db.alliance.getPermissions = () => {
				return {};
			};

			db.alliance.invite = (plyId, allyId) => {
				assert(false);
			};

			Alliances.invite({ name: 'plyName' }, playerId, allianceId);
		});
	});

	describe('choiceInvite()', () => {
		it('choice = true', () => {
			let steps = 0;
			const playerName = 'myPlayerName';
			const currPlayer = {
				id: 'plyId',
				ally: null,
			};

			db.alliance.hasBeenInvited = () => {
				steps++;
				return true;
			};

			db.player.updateAlly = () => { steps++; };

			db.alliance.removeInvitations = () => { steps++; };

			db.alliance.find = () => {
				steps++;
				return {
					id: 'MyAllyId',
					name: 'MyAllyName',
					description: 'MyAllyDesc',
				};
			};

			io.to = (sid) => {
				return {
					emit: (event, content) => {
						if(event === 'player-alliance-data') {
							assert.equal(steps, 4);
						}
					},
				};
			};

			Alliances.choiceInvite(currPlayer, playerName, true);
		});

		it('choice = false', () => {
			let steps = 0;
			const playerName = 'myPlayerName';
			const currPlayer = {
				id: 'plyId',
				ally: null,
			};

			db.alliance.hasBeenInvited = () => {
				steps++;
				return true;
			};

			db.player.updateAlly = () => { steps++; };

			db.alliance.removeInvitations = () => { steps++; };

			db.alliance.find = () => {
				steps++;
				return {
					id: 'MyAllyId',
					name: 'MyAllyName',
					description: 'MyAllyDesc',
				};
			};

			io.to = (sid) => {
				return {
					emit: (event, content) => {
						if(event === 'player-alliance-data') {
							assert.equal(steps, 3);
						}
					},
				};
			};

			Alliances.choiceInvite(currPlayer, playerName, false);
		});

		it('hasBeenInvited = false', () => {
			db.alliance.hasBeenInvited = () => {
				return false;
			};

			io.to = (sid) => {
				return {
					emit: (event, content) => {
						if(event === 'player-alliance-data') {
							assert(false);
						}
					},
				};
			};

			Alliances.choiceInvite({ ally: null }, 'allyId', false);
		});

		it('ally != null', () => {
			io.to = (sid) => {
				return {
					emit: (event, content) => {
						if(event === 'player-alliance-data') {
							assert.equal(steps, 4);
						}
					},
				};
			};

			Alliances.choiceInvite({ ally: 'foo' }, 'allyId', false);
		});
	});

	describe('# kick()', () => {
		it('Should Work', () => {
			const userData = {
				id: 'MyId',
			};

			db.alliance.getPermissions = () => {
				return { leader: true };
			};

			db.player.findByName = () => {
				return userData;
			};

			db.player.updateAlly = (newPlayer) => {
				assert(isset(newPlayer, 'object'));
			};

			db.alliance.dropPermissions = (id) => {
				assert(id, userData.id);
			};

			Alliances.kick({}, 'playerName');
		});

		it('No perms', () => {
			db.alliance.getPermissions = () => {
				return {};
			};

			db.player.updateAlly = () => {
				assert(false);
			};

			db.alliance.dropPermissions = () => {
				assert(false);
			};

			Alliances.kick({}, 'playerName');
		});
	});

	describe('# editPermissions()', () => {
		it('too much rights', () => {
			db.alliance.setPermissions = () => { assert(false); };

			Alliances.editPermissions({}, 'plyName', true, true, true);

			Alliances.editPermissions({}, 'plyName', true, true, false);
			Alliances.editPermissions({}, 'plyName', true, false, true);
			Alliances.editPermissions({}, 'plyName', false, true, true);
		});

		it('currPlayer has no rights', () => {
			db.alliance.getPermissions = () => { return { }; };

			db.alliance.setPermissions = () => { assert(false); };

			Alliances.editPermissions({}, 'plyName', false, false, true);
		});

		it('currPlayer has no rights to grant leader/founder permissions', () => {
			db.alliance.getPermissions = () => { return { leader: true }; };

			db.alliance.setPermissions = () => { assert(false); };

			Alliances.editPermissions({}, 'plyName', true, false, false);
			Alliances.editPermissions({}, 'plyName', false, true, false);
		});

		it('Assign diplomacy permissions', () => {
			const userData = {
				id: 'plyId',
			};

			db.alliance.getPermissions = () => { return { leader: true }; };

			db.player.findByName = () => { return userData; };

			db.alliance.setPermissions = (ply, founder, leader, diplomacy) => {
				assert.equal(userData.id, ply);
				assert(!founder);
				assert(!leader);
				assert(diplomacy);
			};

			Alliances.editPermissions({}, 'userName', false, false, true);
		});

		it('Assign leader permissions', () => {
			const userData = {
				id: 'plyId',
			};

			db.alliance.getPermissions = () => { return { founder: true }; };

			db.player.findByName = () => { return userData; };

			db.alliance.setPermissions = (ply, founder, leader, diplomacy) => {
				assert.equal(userData.id, ply);
				assert(!founder);
				assert(leader);
				assert(!diplomacy);
			};

			Alliances.editPermissions({}, 'userName', false, true, false);
		});
	});
});
