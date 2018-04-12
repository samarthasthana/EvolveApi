const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');
const configDev = require('./app/Configs/config-dev');
const configTest = require('./app/Configs/config-test');
const usersRouter = require('./app/Routers/usersRouter');
const authenticationRouter = require('./app/Routers/authenticationRouter');

const port = process.env.PORT || 8080;

if (process.env.NODE_ENV === 'test') {
    mongoose.connect(configTest.database);
    app.set('superSecret', configTest.secret);
} else {
    mongoose.connect(configDev.database);
    app.set('superSecret', configDev.secret);
}


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

// =======================
// Ready Player One!!
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port); 

module.exports = app; // for testing