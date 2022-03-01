const express = require('express');
const { check, validationResult } = require('express-validator');
const writeToJson = require('./modules');
const contacts = require('./contacts');

const router = express.Router();

// variables
let validateResult = false;
let editId = null;
let nameErrMessage;
let phoneErrMessage;

router.get('/edit/:id', (req, res) => {
	editId = parseInt(req.params.id, 10);
	const contact = contacts.find((cur) => cur.id === editId);

	res.render('edit', {
		title: 'edit',
		cssLink: '/styles.css',
		nameVal: contact.name,
		phoneVal: contact.phone,
	});
});

router.get('/new', (req, res) => {
	res.render('newContact', {
		title: 'New contact',
		cssLink: '/styles.css',
	});
});

// validation middleware
router.use(
	[
		check('phone')
			.matches(/^(\+374)(\(\d{2}\))(\d{6})$/)
			.withMessage('phone required in valid formate'),
		check('name')
			.notEmpty()
			.withMessage('name required')
			.bail()
			.isLength({ min: 2 })
			.withMessage('input you name')
			.bail()
			.isString()
			.matches(/^[A-Za-z]+$/)
			.withMessage('cannot contain numbers or symbols '),
	],
	// eslint-disable-next-line consistent-return
	(req, res, next) => {
		const errors = validationResult(req);

		const amCodes = [
			11, 33, 41, 43, 49, 55, 77, 91, 93, 94, 95, 96, 98, 99,
		];
		const cellPhoneCode = req.body.phone.slice(5, 7) * 1;
		let code = amCodes.find((el) => el === cellPhoneCode);
		if (!code) phoneErrMessage = 'no such mobile code';
		console.log(code);
		if (!errors.isEmpty() || !code) {
			validateResult = false;

			const errArr = errors.array();
			errArr.forEach((el) => {
				if (el.param === 'phone') phoneErrMessage = el.msg;
				if (el.param === 'name') nameErrMessage = el.msg;
			});

			res.status(404);
			if (req.url === '/new') {
				res.render('newContact', {
					title: 'New contact',
					cssLink: '../styles.css',
					nameVal: req.body.name,
					phoneVal: req.body.phone,
					nameWarning: nameErrMessage,
					telWarning: phoneErrMessage,
				});
			} else if (req.url === '/edit') {
				res.render('edit', {
					title: 'Edit contact',
					cssLink: '../styles.css',
					nameVal: req.body.name,
					phoneVal: req.body.phone,
					nameWarning: nameErrMessage,
					telWarning: phoneErrMessage,
				});
			}

			phoneErrMessage = '';
			nameErrMessage = '';
			return next();
		}
		validateResult = true;
		code = null;
		next();
	}
);

router.post('/new', (req, res) => {
	if (validateResult) {
		const newContactId = Math.round(Math.random() * 1000000);
		const newContact = { id: newContactId, ...req.body };

		contacts.push(newContact);
		writeToJson(contacts);

		validateResult = false;

		res.status(201);
		res.render('contactAdded', {
			title: 'New contact',
			cssLink: '../styles.css',
			txt: 'New contact added',
		});
	}
});

router.post(`/edit/`, (req, res) => {
	if (validateResult) {
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
	}
});

module.exports = router;
