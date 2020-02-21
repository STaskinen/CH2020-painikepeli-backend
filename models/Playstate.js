const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StateSchema = new Schema({
    username: String,
    score: Number
});

module.exports = State = mongoose.model('states', StateSchema);