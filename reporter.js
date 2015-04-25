var path = require('path'),
	util = require('util');
module.exports = function (err) {
	return function (results) {
		err.message += ((err.message && results.length) ? '\n' : '') +
			results.map(function (result) {
				var e = result.error;
				return util.format(
					'%s%s\n at (%s:%d:%d)',
					e.reason, e.code ? ' (' + e.code + ')' : '',
					path.resolve(result.file), e.line, e.character
				);
			}).join('\n');
	};
};
