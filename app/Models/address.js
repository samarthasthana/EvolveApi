var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Address', new Schema({
    addressLine1: String,
    addressLine2: String,
    city: Boolean,
    state: String,
    country: String,
    zip: String,
    email: String,
    phone: String
}));