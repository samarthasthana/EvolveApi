const Joi = require('joi');
const utils = require('../../Utils/appUtils');
const userSchema = require('../Schemas/userSchema');

module.exports = {
    createUserValidate: (req, res) => {
        debugger;
        if (req && req.body) {
            const ret = Joi.validate(req.body, userSchema.schema, { allowUnknown: false, abortEarly: false });
            if (ret.error) {
                utils.handleError(ret.error.toString());
                res.status(400).end(ret.error.toString());
                return false;
            }
            return true;
        } else {
            utils.handleError('Invalid request body');
            res.status(400).end('Invalid request body');
            return false;
        }
    }
};