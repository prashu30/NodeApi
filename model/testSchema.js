const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
    name: String,
    email: String,
    about: String,
    secret: String
},{timestamps: true})

const Test = mongoose.model('Test', testSchema);

module.exports = Test;