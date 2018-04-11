const Joi = require('joi');

module.exports = {
    schema: Joi.object({
        username: Joi.string().min(5).max(50).required(),
        password: Joi.string().min(5).required(),
        admin: Joi.boolean()    
    })
};