// this file read only once when application starts and its data need first, so this file have to be read by sync way

module.exports = JSON.parse(
	require('fs').readFileSync(`${__dirname}/jsonData/contacts.json`)
);
