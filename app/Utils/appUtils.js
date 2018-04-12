const appConstants = require('../Constant/constants');
const config = require('../Configs/config-dev');
const jwt = require('jsonwebtoken');

module.exports = {
    handleError: (errMsg) => {
        console.log(errMsg);
        return errMsg;
    },
    verifyUserAuth: (req, res, next) => {
        try {
            if (req && req.headers['authorization']) {
                const token = req.headers['authorization'].includes(appConstants.Bearer)
                    ? req.headers['authorization'].split(' ')[1] : req.headers['authorization'];
                if (token) {
                    const verificationStatus = jwt.verify(token, config.secret, (err, decoded) => {
                        if (err) {
                            console.log(`Error verifying token, ${err}`);
                            res.status(500).end(`Error verifying token, ${err}`);
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
            console.log(`Error verifying token, ${error}`);
            res.status(500).end(`Error verifying token, ${error}`);
        }        
    }
};