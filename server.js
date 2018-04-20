const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const usersRouter = require('./app/Routers/usersRouter');
const resumeRouter = require('./app/Routers/resumeRouter');
const authenticationRouter = require('./app/Routers/authenticationRouter');

require('dotenv').config();

const port = Number(process.env.PORT) || 8080;

(process.env.NODE_ENV === 'test') ? mongoose.connect(process.env.DB_TEST) : mongoose.connect(process.env.DB_DEV);
app.set('superSecret', process.env.SECRET);

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console <needs research>
app.use(morgan('dev'));

app.get('/', function (req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

app.use('/api/users', usersRouter);
app.use('/api/login', authenticationRouter);
// app.use('/api/resume', resumeRouter);

// =======================
// Ready Player One!!
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port); 

module.exports = app; // for testing