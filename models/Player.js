const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
    username: String,
    score: Number
});

module.exports = Player = mongoose.model('players', PlayerSchema);