const express = require('express');
const router = express.Router();
const User = require('../Models/user');
const utils = require('../Utils/appUtils');
const config = require('../Configs/config-dev');
const bcrypt = require('bcryptjs');

const userValidationRules = require('../Validations/Rules/userValidations');

// router.get('/', utils.verifyUserAuth, (req, res) => {
//     // try {
//     //     //If not authorized then forbidden
//     //     if (!req.decodedUser || !req.decodedUser.user) {
//     //         res.sendStatus(403);
//     //     }

//     //     User.find((err, users) => {
//     //         if (err) {
//     //             res.status(500).end(utils.handleError(`Error fetching all users, ${err.msg}`));
//     //         } else {
//     //             res.json(users);
//     //         }
//     //     });
//     // } catch (error) {
//     //     utils.handleError(`Internal server error, ${error}`)
//     //     res.sendStatus(500);
//     // }
// });