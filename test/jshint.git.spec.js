require('../index.js')({
	title: 'git modified and commits',
	git: {
		modified: true,
		commits: 9999
	}
});

require('../index.js')({
	title: 'git modified, commits and masterDiff',
	git: {
		modified: true,
		commits: 5,
		masterDiff:true
	}
});