require('../index.js')({
	title: 'git with exec option',
	exec: {
		modified: true,
		maxBuffer: 20*1024*1024
	}
});
