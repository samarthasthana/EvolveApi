const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const User = require('../Models/user'); // get our mongoose model
const utils = require('../Utils/appUtils')
const config = require('../Configs/config')
const bcrypt = require('bcryptjs')


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
                password: bcrypt.hashSync(req.body.password, config.salt),
                admin: false
            }
            User.create(requestedUser, (err, user) => {
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

// Update a User 
router.put('/:id', (req, res) => {
    if (req.params.id) {
        const user = User.findById(req.params.id, (err, user) => {
            return err ? {} : user;
        });
        if (user) {
            if (req.body.password) {
                req.body.password = bcrypt.hashSync(req.body.password, config.salt);
            }
            const requestedUser = Object.assign({}, user, req.body);
            User.findByIdAndUpdate(req.params.id, requestedUser, (err, user) => {
                if (err) {
                    res.json(utils.handleError(`User not updated, ${err}`));
                } else {
                    res.json(user);
                }
            });
        } else {
            res.json(utils.handleError('User not found, update failed'));
        }
    } else {
        res.json(utils.handleError('No user id found'));
    }
});

// Delete User
router.delete('/:id', (req, res) => {
    if (req.params.id) {
        User.findOneAndRemove(req.params.id, (err, user) => {
            if (err) {
                res.json(utils.handleError(`User not deleted, ${err}`));
            } else {
                res.json(user);
            }
        });
    } else {
        res.json(utils.handleError('No user id found'));
    }
});

module.exports = router;