describe('• misc', () => {
	/**
	 * isset
	 */
	describe('# isset()', () => {
		it('isset(undefined)', () => {
			assert.equal(isset(undefined), false);
		});
		it('isset(null)', () => {
			assert.equal(isset(undefined), false);
		});
		it('isset(?, \'wrong type\')', () => {
			assert.equal(isset('blah','test'), false);
		});

		// strings
		it('isset(0, \'string\')', () => {
			assert.equal(isset(0, 'string'), false);
		});
		it('isset(1, \'string\')', () => {
			assert.equal(isset(1, 'string'), false);
		});
		it('isset({}, \'string\')', () => {
			assert.equal(isset({}, 'string'), false);
		});
		it('isset([], \'string\')', () => {
			assert.equal(isset([], 'string'), false);
		});
		it('isset(\'\', \'string\')', () => {
			assert.equal(isset('', 'string'), false);
		});
		it('isset(\'    \', \'string\')', () => {
			assert.equal(isset('    ', 'string'), false);
		});
		it('isset(\'test\', \'string\')', () => {
			assert.equal(isset('test', 'string'), true);
		});

		// booleans
		it('isset(0, \'boolean\')', () => {
			assert.equal(isset(0, 'boolean'), false);
		});
		it('isset(1, \'boolean\')', () => {
			assert.equal(isset(1, 'boolean'), false);
		});
		it('isset({}, \'boolean\')', () => {
			assert.equal(isset({}, 'boolean'), false);
		});
		it('isset([], \'boolean\')', () => {
			assert.equal(isset([], 'boolean'), false);
		});
		it('isset(\'test\', \'boolean\')', () => {
			assert.equal(isset('test', 'boolean'), false);
		});
		it('isset(false, \'boolean\')', () => {
			assert.equal(isset(false, 'boolean'), true);
		});
		it('isset(true, \'boolean\')', () => {
			assert.equal(isset(true, 'boolean'), true);
		});

		// arrays
		it('isset(0, \'array\')', () => {
			assert.equal(isset(0, 'array'), false);
		});
		it('isset(1, \'array\')', () => {
			assert.equal(isset(1, 'array'), false);
		});
		it('isset({}, \'array\')', () => {
			assert.equal(isset({}, 'array'), false);
		});
		it('isset([], \'array\')', () => {
			assert.equal(isset([], 'array'), false);
		});
		it('isset([1,2,3], \'array\')', () => {
			assert.equal(isset([1,2,3], 'array'), true);
		});
		it('isset(\'test\', \'array\')', () => {
			assert.equal(isset('test', 'array'), false);
		});

		// objects
		it('isset(0, \'object\')', () => {
			assert.equal(isset(0, 'object'), false);
		});
		it('isset(1, \'object\')', () => {
			assert.equal(isset(1, 'object'), false);
		});
		it('isset({}, \'object\')', () => {
			assert.equal(isset({}, 'object'), false);
		});
		it('isset({ test: \'test\' }, \'object\')', () => {
			assert.equal(isset({ test: 'test' }, 'object'), true);
		});
		it('isset([], \'object\')', () => {
			assert.equal(isset([], 'object'), false);
		});
		it('isset([1,2,3], \'object\')', () => {
			assert.equal(isset([1,2,3], 'object'), false);
		});
		it('isset(\'test\', \'object\')', () => {
			assert.equal(isset('test', 'object'), false);
		});
		it('isset(\'inheritence\')', () => {
			class Parent {
				motherFunc() {

				}
			}

			class Child extends Parent {

			}

			assert.equal(isset(new Child(), 'object'), false);
		});

		// numbers
		it('isset(0, \'number\')', () => {
			assert.equal(isset(0, 'number'), true);
		});
		it('isset(1, \'number\')', () => {
			assert.equal(isset(1, 'number'), true);
		});
		it('isset({}, \'number\')', () => {
			assert.equal(isset({}, 'number'), false);
		});
		it('isset([], \'number\')', () => {
			assert.equal(isset([], 'number'), false);
		});
		it('isset(\'test\', \'number\')', () => {
			assert.equal(isset('test', 'number'), false);
		});

		// no type
		it('isset(0)', () => {
			assert.equal(isset(0), true);
		});
		it('isset(1)', () => {
			assert.equal(isset(1), true);
		});
		it('isset({})', () => {
			assert.equal(isset({}), false);
		});
		it('isset({ test: \'test\' })', () => {
			assert.equal(isset({ test: 'test' }), true);
		});
		it('isset([])', () => {
			assert.equal(isset([]), false);
		});
		it('isset([1,2,3])', () => {
			assert.equal(isset([1,2,3]), true);
		});
		it('isset(\'\', \'string\')', () => {
			assert.equal(isset('', 'string'), false);
		});
		it('isset(\'test\')', () => {
			assert.equal(isset('test'), true);
		});
		it('isset(\'Symbol(42)\')', () => {
			assert.equal(isset(Symbol(42)), true);
		});
	});

	/**
	 * normalizeText
	 */
	describe('# normalizeText()', () => {
		it('normalizeText (normal text)', () => {
			assert.equal(
				normalizeText('test a tester e'),
				'test a tester e'
			);
		});
		it('normalizeText (text to normalized)', () => {
			assert.equal(
				normalizeText('test à tester é'),
				'test &agrave; tester &eacute;'
			);
		});
	});

	/**
	 * unNormalizeText
	 */
	describe('# unNormalizeText()', () => {
		it('unNormalizeText (normal text)', () => {
			assert.equal(
				unNormalizeText('test a tester e'),
				'test a tester e'
			);
		});
		it('unNormalizeText (normalized to text)', () => {
			assert.equal(
				unNormalizeText('test &agrave; tester &eacute;'),
				'test à tester é'
			);
		});
	});

	/**
	 * textToSmileys
	 */
	describe('# textToSmileys()', () => {
		it('textToSmileys (normal text)', () => {
			assert.equal(
				textToSmileys(': test )'),
				': test )'
			);
		});
		it('textToSmileys (text to smiley)', () => {
			assert.equal(
				textToSmileys(':D test :)'),
				'😃 test 🙂'
			);
		});
	});

	describe('# filterUnwantedChars()', () => {
		it('Blacklisted char/strings: filterUnwantedChars("normal message")', () => {
			assert.equal(
				filterUnwantedChars('normal message'),
				'normal message'
			);
		});
		it('Blacklisted char/strings: filterUnwantedChars("< test")', () => {
			assert.equal(
				filterUnwantedChars('< test'),
				' test'
			);
		});
	});

	/**
	 * parseChatTime
	 */
	describe('# parseChatTime()', () => {
		it('parseChatTime (error)', () => {
			assert.equal(
				parseChatTime('aaa'),
				-1
			);
		});
		it('parseChatTime (1 day)', () => {
			assert.equal(
				parseChatTime('1d'),
				86400000
			);
		});
		it('parseChatTime (2 hour)', () => {
			assert.equal(
				parseChatTime('2h'),
				7200000
			);
		});
		it('parseChatTime (3 minutes)', () => {
			assert.equal(
				parseChatTime('3m'),
				180000
			);
		});
		it('parseChatTime (4 minutes)', () => {
			assert.equal(
				parseChatTime('4s'),
				4000
			);
		});
		it('parseChatTime (5 odd unit)', () => {
			assert.equal(
				parseChatTime('5g'),
				-1
			);
		});
	});

	/**
	 * getDateTime
	 * /!\ les mois vont de 0 a 11 dans le constructeur de Date()
	 */
	describe('# getDateTime()', () => {
		it('getDateTime(01/01/2001 01:01:01)', () => {
			assert.equal(
				getDateTime(new Date(2001,0,1,1,1,1)),
				'01/01/2001 01:01:01'
			);
		});
		it('getDateTime(10/10/2010 10:10:10)', () => {
			assert.equal(
				getDateTime(new Date(2010,9,10,10,10,10)),
				'10/10/2010 10:10:10'
			);
		});
	});
});