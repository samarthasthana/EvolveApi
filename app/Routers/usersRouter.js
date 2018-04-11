const express = require('express');
const router = express.Router();
const User = require('../Models/user'); // get our mongoose model
const utils = require('../Utils/appUtils')
const config = require('../Configs/config')
const appConstants = require('../Constant/constants')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken'); 


// Get All Users: 
router.get('/', (req, res) => {
    User.find((err, users) => {
        if (err) {
            utils.handleError(`Error fetching all users, ${err.msg}`);
            res.sendStatus(500);
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
                admin: true
            }
            User.create(requestedUser, (err, user) => {
                if (err) {
                    utils.handleError(`Error creating user, ${err.msg}`)
                    res.status(500);
                }
                else {
                    res.json(user);
                }
            });
        } catch (error) {
            utils.handleError(`Error creating user, ${error.msg}`)
            res.sendStatus(500);
        }
    } else {
        utils.handleError('No request body found')
        res.sendStatus(400);
    }
});

// Update a User 
router.put('/:id', verifyUserAuth, (req, res) => {
    debugger;
    // If not admin then forbidden
    try {
        if (!req.decodedUser || !req.decodedUser.user || !req.decodedUser.user.admin) {
            res.sendStatus(403);
        }
    
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
                        utils.handleError(`User not updated, ${err}`)
                        res.sendStatus(500);
                    } else {
                        res.json(user);
                    }
                });
            } else {
                utils.handleError('User not found, update failed')
                res.sendStatus(500);
            }
        } else {
            utils.handleError('No user id found')
            res.sendStatus(400);
        }        
    } catch (error) {
        utils.handleError(`Internal server error, ${error}`)
        res.sendStatus(500);
    }
    
});

// Delete User
router.delete('/:id', (req, res) => {
    if (req.params.id) {
        User.findOneAndRemove(req.params.id, (err, user) => {
            if (err) {
                utils.handleError(`User not deleted, ${err}`);
                res.sendStatus(500);
            } else {
                res.json(user);
            }
        });
    } else {
        utils.handleError('No user id found')
        res.sendStatus(400);
    }
});

function verifyUserAuth(req, res, next) {
    debugger;
    try {
        if (req && req.headers['authorization']) {
            const token = req.headers['authorization'].includes(appConstants.Bearer)
                ? req.headers['authorization'].split(' ')[1] : req.headers['authorization'];
            if (token) {
                const verificationStatus = jwt.verify(token, config.secret, (err, decoded) => {
                    if (err) {
                        utils.handleError(`Error verifying token, ${err}`);
                        res.sendStatus(500);
                    } else {
                        req.decodedUser = decoded;
                        next();
                    }
                });
            } else {
                res.sendStatus(403);
            }
        } else {
            res.sendStatus(403);
        }
        
    } catch (error) {
        utils.handleError(`Error verifying token, ${error}`);
        res.sendStatus(500);
    }
    
};

module.exports = router;