var path = require('path'),
	util = require('util');

function createBlankError(){
	var error = new Error('');
	error.message = '';
	error.stack = '';
	return error;
}

function Reporter () {
	this.error = createBlankError();
	this.report = this.report.bind(this);	
}

Reporter.prototype = {
	report: function (results) {
		var err = this.error;
		results.forEach(function (result) {
			var file = result.file;
			var error = result.error;
			if (err.message) {
				err.stack += '\n';
			}
			err.message = 
				util.format('%s%s', error.reason, error.code ? ' (' + error.code + ')' : '') ||
				util.format('jshint error%s', results.length && 's' || '');
			err.stack += util.format('%s\n at (%s:%d:%d)', err.message, path.resolve(file), error.line, error.character);
		});
		return err;
	}
};

module.exports = Reporter;
