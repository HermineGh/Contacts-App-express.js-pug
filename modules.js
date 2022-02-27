const fs = require('fs');

module.exports = (data) => {
	fs.writeFile(
		`${__dirname}/jsonData/contacts.json`,
		JSON.stringify(data),
		(err) => {
			if (err) console.log(err.message);
		}
	);
};
