var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Experience', new Schema({
    companyName: String,
    position: String,
    projectName: String,
    location: String,    
    technologies: String[],
    workEntries: String[],
    startDate: Date,
    endDate: Date
}));