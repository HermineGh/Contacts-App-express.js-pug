const express = require('express');
const morgan = require('morgan');
let contacts = require('./contacts');
const writeToJson = require('./modules');

const contentsRouter = require('./contacts.router');

let delContactId;
const contactApp = express();

contactApp.use(morgan('dev'));

// error handling
contactApp.use((err, req, res, next) => {
	res.status(500).send('something wrong');
	next();
});

contactApp.use(express.static('public'));

/* _____middleware ________ */

// middleware for parsing json data
contactApp.use(express.json());

// middleware parsing forms data
contactApp.use(
	express.urlencoded({
		extended: true,
	})
);

/* _____view engine ________ */
contactApp.set('view engine', 'pug');

/* _____Home page rendering ________ */
contactApp.get('/', (req, res) => {
	res.render('index', {
		title: 'Contacts',
		contacts,
		cssLink: '/styles.css',
	});
});

contactApp.post('/', (req, res) => {
	res.status(200).json({
		status: 'success',
		data: {
			contacts,
		},
	});
});

contactApp.delete('/', (req, res) => {
	contacts = contacts.filter((el) => el.id !== delContactId * 1);
	writeToJson(contacts);
	res.status(204).json({
		status: 'success',
	});
});

/* _____Delete confirmation ________ */
contactApp.get('/modal/:id', (req, res) => {
	delContactId = req.params.id;
	res.render('modal', {
		title: 'Contacts',
		contacts,
		cssLink: '/styles.css',
	});
});

contactApp.use('/contacts', contentsRouter);

// for all others
contactApp.get('*', (req, res) => {
	res.sendStatus(404);
});

// server
contactApp.listen(3000, () => {
	console.log('Listening...');
});
