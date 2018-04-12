var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Education', new Schema({
    collegeName: String,
    degreeName: String,
    fieldOfStudy: String,
    gpa: String,
    gradDate: Date
}));