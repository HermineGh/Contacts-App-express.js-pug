let contacts = require('../contacts');
const writeToJson = require('../modules');

let delContactId;

exports.getData = (req, res) => {
	res.render('index', {
		title: 'Contacts',
		contacts,
		cssLink: '/styles.css',
	});
};
exports.deleteContact = (req, res) => {
	contacts = contacts.filter((el) => el.id !== delContactId * 1);
	writeToJson(contacts);
	res.status(204).json({
		status: 'success',
	});
};
exports.getModal = (req, res) => {
	delContactId = req.params.id;
	res.render('modal', {
		title: 'Contacts',
		contacts,
		cssLink: '/styles.css',
	});
};
