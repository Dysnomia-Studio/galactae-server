/**
 * Libs
 */
const assert = require('assert');

/**
 * My libs
 */
require('../calcConstants')();
require('../misc')();

describe('• misc', function() {
	/**
	 * isset
	 */
	describe('# isset()', function() {
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
	});

	/**
	 * normalizeText
	 */
	describe('# normalizeText()', function() {
		it('normalizeText (normal text)', function() {
			assert.equal(
				normalizeText('test a tester e'),
				'test a tester e'
			);
		});
		it('normalizeText (text to normalized)', function() {
			assert.equal(
				normalizeText('test à tester é'),
				'test &agrave; tester &eacute;'
			);
		});
	});

	/**
	 * unNormalizeText
	 */
	describe('# unNormalizeText()', function() {
		it('unNormalizeText (normal text)', function() {
			assert.equal(
				unNormalizeText('test a tester e'),
				'test a tester e'
			);
		});
		it('unNormalizeText (normalized to text)', function() {
			assert.equal(
				unNormalizeText('test &agrave; tester &eacute;'),
				'test à tester é'
			);
		});
	});

	/**
	 * textToSmileys
	 */
	describe('# textToSmileys()', function() {
		it('textToSmileys (normal text)', function() {
			assert.equal(
				textToSmileys(': test )'),
				': test )'
			);
		});
		it('textToSmileys (text to smiley)', function() {
			assert.equal(
				textToSmileys(':D test :)'),
				'😃 test 🙂'
			);
		});
	});

	describe('# filterUnwantedChars()', function() {
		it('Blacklisted char/strings: filterUnwantedChars("normal message")', function() {
			assert.equal(
				filterUnwantedChars('normal message'),
				'normal message'
			);
		});
		it('Blacklisted char/strings: filterUnwantedChars("< test")', function() {
			assert.equal(
				filterUnwantedChars('< test'),
				' test'
			);
		});
	});

	/**
	 * parseChatTime
	 */
	describe('# parseChatTime()', function() {
		it('parseChatTime (error)', function() {
			assert.equal(
				parseChatTime('aaa'),
				-1
			);
		});
		it('parseChatTime (1 day)', function() {
			assert.equal(
				parseChatTime('1d'),
				86400000
			);
		});
		it('parseChatTime (2 hour)', function() {
			assert.equal(
				parseChatTime('2h'),
				7200000
			);
		});
		it('parseChatTime (3 minutes)', function() {
			assert.equal(
				parseChatTime('3m'),
				180000
			);
		});
		it('parseChatTime (4 minutes)', function() {
			assert.equal(
				parseChatTime('4s'),
				4000
			);
		});
		it('parseChatTime (5 odd unit)', function() {
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
	describe('# getDateTime()', function() {
		it('getDateTime(01/01/2001 01:01:01)', function() {
			assert.equal(
				getDateTime(new Date(2001,0,1,1,1,1)),
				'01/01/2001 01:01:01'
			);
		});
		it('getDateTime(10/10/2010 10:10:10)', function() {
			assert.equal(
				getDateTime(new Date(2010,9,10,10,10,10)),
				'10/10/2010 10:10:10'
			);
		});
	});
});