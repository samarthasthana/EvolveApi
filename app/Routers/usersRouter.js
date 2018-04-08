var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');

var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var User = require('../Models/user'); // get our mongoose model
var utils = require('../Utils/appUtils')


// Get All Users: 
router.get('/', (req, res) => {
    User.find((err, users) => {
        if (err) {
            res.json(utils.handleError(`Error fetching all users, ${err.msg}`));
        } else {
            res.json(users);
        }
    });
});


//Create new User
router.post('/', (req, res) => {
    if (req.body) {
        try {
            requestedUser = {
                name: req.body.name,
                pwd: req.body.pwd,
                admin: false
            }
            User.create(req.body, (err, user) => {
                if (err) {
                    res.json(utils.handleError(`Error creating user, ${err.msg}`));
                }
                else {
                    res.json(user);
                }
            });
        } catch (error) {
            res.json(utils.handleError(`Error creating user, ${error.msg}`));
        }
    } else {
        res.json(utils.handleError('No request body found'));
    }
});

module.exports = router;