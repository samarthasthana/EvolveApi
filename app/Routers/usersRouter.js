const express = require('express');
const router = express.Router();
const User = require('../Models/user');
const utils = require('../Utils/appUtils');
const bcrypt = require('bcryptjs');

const userValidationRules = require('../Validations/Rules/userValidations');


// Get All Users: 
router.get('/', utils.verifyUserAuth, (req, res) => {
    try {
        //If not authorized then forbidden
        if (!req.decodedUser || !req.decodedUser.user) {
            res.sendStatus(403);
        }

        User.find((err, users) => {
            if (err) {
                res.status(500).end(utils.handleError(`Error fetching all users, ${err.msg}`));
            } else {
                res.json(users);
            }
        });
    } catch (error) {
        utils.handleError(`Internal server error, ${error}`)
        res.sendStatus(500);
    }
});

//Create new User
router.post('/', utils.verifyUserAuth, (req, res) => {
    //If not authorized then forbidden, If not admin then admin creation is forbidden
    if (!req.decodedUser || !req.decodedUser.user || (req.decodedUser.user.admin !== req.body.admin)) {
        res.sendStatus(403);
    }

    const ret = userValidationRules.createUserValidate(req, res);
    if (ret) {
        try {
            requestedUser = {
                username: req.body.username,
                password: bcrypt.hashSync(req.body.password, Number(process.env.SALT)),
                admin: true
            }
            User.create(requestedUser, (err, user) => {
                if (err) {
                    res.status(500).end(utils.handleError(`Error creating user, ${err.msg}`));
                }
                else {
                    res.json(user);
                }
            });
        } catch (error) {
            res.status(500).end(utils.handleError(`Error creating user, ${err.msg}`));
        }
    }
});

// Update a User 
router.put('/:id', utils.verifyUserAuth, (req, res) => {
    try {
        // If not admin then forbidden
        if (!req.decodedUser || !req.decodedUser.user || !req.decodedUser.user.admin) {
            res.sendStatus(403);
        }

        if (req.params.id) {
            const user = User.findById(req.params.id, (err, user) => {
                return err ? {} : user;
            });
            if (user) {
                if (req.body.password) {
                    req.body.password = bcrypt.hashSync(req.body.password, Number(process.env.SALT));
                }
                const requestedUser = Object.assign({}, user, req.body);
                User.findByIdAndUpdate(req.params.id, requestedUser, (err, user) => {
                    if (err) {
                        res.status(500).end(utils.handleError(`User not updated, ${err}`));
                    } else {
                        res.json(user);
                    }
                });
            } else {
                res.status(400).end(utils.handleError('User not found, update failed'));
            }
        } else {
            res.status(400).end(utils.handleError('Invalid parameter, update failed'));
        }
    } catch (error) {
        res.status(500).end(utils.handleError(`User not updated, ${error}`));
    }
});

// Delete User
router.delete('/:id', utils.verifyUserAuth, (req, res) => {
    try {
        // If not authorized then forbidden
        if (!req.decodedUser || !req.decodedUser.user || !req.decodedUser.admin) {
            res.sendStatus(403);
        }

        if (req.params.id) {
            User.findOneAndRemove(req.params.id, (err, user) => {
                if (err) {
                    res.status(500).end(utils.handleError(`User not deleted, ${err}`));
                } else {
                    res.json(user);
                }
            });
        } else {
            res.status(400).end(utils.handleError('Invalid parameter, delete failed'));
        }
    } catch (error) {
        res.status(500).end(utils.handleError(`Internal server error, ${error}`));
    }
});

module.exports = router;