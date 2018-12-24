/**
 * Libs
 */
let assert = require('assert');

/**
 * My libs
 */
require('../misc')();

describe('• misc', function() {
	/**
	 * isset
	 */
	describe('# isset()', function() {
		it('isset(undefined)', function() {
			var test;
			assert.equal(
				isset(test),
				false
			);
		});
		it('isset(defined number)', function() {
			var test = 1;
			assert.equal(
				isset(test),
				true
			);
		});

		it('isset(empty string)', function() {
			var test = "";
			assert.equal(
				isset(test),
				false
			);
		});

		it('isset(spaces string)', function() {
			var test = " ";
			assert.equal(
				isset(test),
				false
			);
		});

		it('isset(defined string)', function() {
			var test = "abcd";
			assert.equal(
				isset(test),
				true
			);
		});
	});

	/**
	 * normalizeText
	 */
	describe('# normalizeText()', function() {
		it('normalizeText (normal text)', function() {
			assert.equal(
				normalizeText("test a tester e"),
				"test a tester e"
			);
		});
		it('normalizeText (text to normalized)', function() {
			assert.equal(
				normalizeText("test à tester é"),
				"test &agrave; tester &eacute;"
			);
		});
	});

	/**
	 * unNormalizeText
	 */
	describe('# unNormalizeText()', function() {
		it('unNormalizeText (normal text)', function() {
			assert.equal(
				unNormalizeText("test a tester e"),
				"test a tester e"
			);
		});
		it('unNormalizeText (normalized to text)', function() {
			assert.equal(
				unNormalizeText("test &agrave; tester &eacute;"),
				"test à tester é"
			);
		});
	});

	/**
	 * textToSmileys
	 */
	describe('# textToSmileys()', function() {
		it('textToSmileys (normal text)', function() {
			assert.equal(
				textToSmileys(": test )"),
				": test )"
			);
		});
		it('textToSmileys (text to smiley)', function() {
			assert.equal(
				textToSmileys(":D test :)"),
				"😃 test 🙂"
			);
		});
	});

	describe('# filterUnwantedChars()', function() {
		it('Blacklisted ascii smileys: filterUnwantedChars("normal message")', function() {
			assert.equal(
				filterUnwantedChars("normal message"),
				"normal message"
			);
		});
		it('Blacklisted ascii smileys: filterUnwantedChars("normal message")', function() {
			assert.equal(
				filterUnwantedChars("< test"),
				" test"
			);
		});
	});

	/**
	 * parseChatTime
	 */
	describe('# parseChatTime()', function() {
		it('parseChatTime (error)', function() {
			assert.equal(
				parseChatTime("aaa"),
				-1
			);
		});
		it('parseChatTime (1 day)', function() {
			assert.equal(
				parseChatTime("1d"),
				86400000
			);
		});
		it('parseChatTime (2 hour)', function() {
			assert.equal(
				parseChatTime("2h"),
				7200000
			);
		});
		it('parseChatTime (3 minutes)', function() {
			assert.equal(
				parseChatTime("3m"),
				180000
			);
		});
		it('parseChatTime (4 odd unit)', function() {
			assert.equal(
				parseChatTime("4g"),
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
				"01/01/2001 01:01:01"
			);
		});
		it('getDateTime(10/10/2010 10:10:10)', function() { 
			assert.equal(
				getDateTime(new Date(2010,9,10,10,10,10)),
				"10/10/2010 10:10:10"
			);
		});
	});
});