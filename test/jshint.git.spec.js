require('../index.js')({
	git: {
		modified: true,
		commits: 9999
	}
});

require('../index.js')({
	git: {
		modified: true,
		commits: 5,
		masterDiff:true
	}
});