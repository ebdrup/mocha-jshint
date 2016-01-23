var assert = require('assert');

describe('fancyReporter', function() {

	var err;

	beforeEach(function() {
		err = new Error();
	});

	it('with no errors', function() {
		var reporter = require('../fancyReporter')(err);
		var errors = [];
		reporter(errors);
		assert.equal(err.message, '');
	});

	it('with single error', function() {
		var reporter = require('../fancyReporter')(err);
		var errors = [
			{
				file: '/tmp/abc.js',
				error: {
					reason: 'Missing semicolon.',
					code: 'W033',
					line: 1,
					character: 1
				}
			}
		];
		reporter(errors);

		var expectedMessage = "Found 1 jshint error(s) in 1 file(s):\n          /tmp/abc.js\n                   1:1     Missing semicolon. (W033)";
		assert.equal(err.message, expectedMessage);
	});

	it('with multiple errors', function() {
		var reporter = require('../fancyReporter')(err);
		var errors = [
			{
				file: '/tmp/abc.js',
				error: {
					reason: 'Missing semicolon.',
					code: 'W033',
					line: 1,
					character: 1
				}
			},
			{
				file: '/tmp/xyz.js',
				error: {
					reason: '\'_\' is defined but never used.',
					code: 'W098',
					line: 3,
					character: 5
				}
			},
			{
				file: '/tmp/abc.js',
				error: {
					reason: 'Identifier \'good_times\' is not in camel case.',
					code: 'W106',
					line: 18,
					character: 0
				}
			}
		];
		reporter(errors);

		var expectedMessage = "Found 3 jshint error(s) in 2 file(s):\n          /tmp/abc.js\n                   1:1     Missing semicolon. (W033)\n                  18:0     Identifier 'good_times' is not in camel case. (W106)\n\n          /tmp/xyz.js\n                   3:5     '_' is defined but never used. (W098)";
		assert.equal(err.message, expectedMessage);
	});

});
