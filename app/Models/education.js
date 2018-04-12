var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Education', new Schema({
    collegeName: String,
    degreeName: String,
    fieldOfStudy: String,
    gpa: String,
    startDate: String,
    endDate: String,
    resume: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resume'
    }
}));