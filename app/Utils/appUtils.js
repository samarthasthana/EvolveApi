const appConstants = require('../Constant/constants');
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
                    const verificationStatus = jwt.verify(token, process.env.SECRET, (err, decoded) => {
                        if (err) {
                            console.log(`Error verifying token, ${err}`);
                            res.status(500).end(`Error verifying token, ${err}`);
                        } else {
                            req.decodedUser = decoded;
                            next();
                        }
                    });
                } else {
                    console.log('No token found');
                    res.sendStatus(403);
                }
            } else {
                console.log('No header found');
                res.sendStatus(403);
            }
            
        } catch (error) {
            console.log(`Error verifying token, ${error}`);
            res.status(500).end(`Error verifying token, ${error}`);
        }        
    }
};