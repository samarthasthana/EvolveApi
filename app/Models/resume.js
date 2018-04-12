var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Resume', new Schema({
    name: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}));