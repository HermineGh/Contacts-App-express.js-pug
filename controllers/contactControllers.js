const contacts = require('../contacts');
const writeToJson = require('../modules');

let editId = null;

exports.getContact = (req, res) => {
	editId = parseInt(req.params.id, 10);
	const contact = contacts.find((cur) => cur.id === editId);

	res.render('edit', {
		title: 'edit',
		cssLink: '/styles.css',
		nameVal: contact.name,
		phoneVal: contact.phone,
	});
};
exports.getNewOne = (req, res) => {
	res.render('newContact', {
		title: 'New contact',
		cssLink: '/styles.css',
	});
};

exports.createContact = (req, res) => {
	const newContactId = Math.round(Math.random() * 1000000);
	const newContact = { id: newContactId, ...req.body };
	console.log(newContact);
	contacts.push(newContact);
	writeToJson(contacts);
	res.status(201);
	res.render('contactAdded', {
		title: 'New contact',
		cssLink: '../styles.css',
		txt: 'New contact added',
	});
};
exports.editContact = (req, res) => {
	const forUpdate = contacts.find((el) => el.id === editId);
	forUpdate.name = req.body.name;
	forUpdate.phone = req.body.phone;

	writeToJson(contacts);

	res.status(201);
	res.render('contactAdded', {
		title: 'Contacts',
		cssLink: '/styles.css',
		txt: 'Changes saved',
	});
};
