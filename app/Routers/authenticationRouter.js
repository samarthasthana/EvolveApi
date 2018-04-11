const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const User = require('../Models/user'); // get our mongoose model
const utils = require('../Utils/appUtils')
const config = require('../Configs/config')
const bcrypt = require('bcryptjs')


// Login authentication
router.post('/', (req, res) => {
    debugger;
    if (req.body && req.body.name && req.body.password) {
        User.findOne(
            {
                name: req.body.name
            }, (err, user) => {
                if (err) {
                    utils.handleError(`Failed authentication, ${err}`);
                    res.sendStatus(403);
                } else {
                    if (user) {
                        bcrypt.compare(req.body.password, user.password, (err, isSuccess) => {
                            if (err) {
                                utils.handleError(`Failed bcrypt comparison, ${err}`);
                                res.sendStatus(500);
                            } else if (isSuccess) {
                                const payload = { user };
                                const token = jwt.sign(payload, config.secret, {
                                    expiresIn: '60m'
                                });
                                res.json({ IsSuccess: true, Token: token });
                            } else {
                                utils.handleError(`Failed authentication, ${err}`);
                                res.sendStatus(403);
                            }
                        });
                    }
                }
            }
        )
    }
});

module.exports = router;