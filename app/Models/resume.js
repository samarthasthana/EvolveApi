var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Resume', new Schema({
    name: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address'
    },
    education: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Education'
    }],
    experience: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Experience'
    }]
}));