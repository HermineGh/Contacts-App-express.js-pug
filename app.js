const express = require('express');
const morgan = require('morgan');
const homeCont = require('./controllers/homeControllers');
const contentsRouter = require('./routers/contacts.router');
const errors = require('./middleware/errors');

const contactApp = express();

contactApp.use(morgan('dev'));

// error handling
contactApp.use(errors);

// for reading static files
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
contactApp.get('/', homeCont.getData);

/* ________Deleting a contact ________ */
contactApp.get('/modal/:id', homeCont.getModal);
contactApp.delete('/', homeCont.deleteContact);

contactApp.use('/contacts', contentsRouter);

// for all others
contactApp.all('*', (req, res) => {
	res.sendStatus(404);
});

module.exports = contactApp;
