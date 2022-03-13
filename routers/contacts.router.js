const express = require('express');
const { check, validationResult } = require('express-validator');

const {
	getContact,
	getNewOne,
	createContact,
	editContact,
} = require('../controllers/contactControllers');

const { validator } = require('../middleware/contactValidation');

const router = express.Router();

// variables
router.get('/edit/:id', getContact);
router.get('/new', getNewOne);

// validation middleware
router.use(
	[
		validator,
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
		let nameErrMessage;
		let phoneErrMessage;
		const errors = validationResult(req);

		if (!errors.isEmpty() || req.mess) {
			if (req.mess) phoneErrMessage = req.mess;
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
			return res.status(400).json({ errors: errors.array() });
		}
		next();
	}
);

router.post('/new', createContact);
router.post(`/edit/`, editContact);

module.exports = router;
