const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
    task_name: {
        username: String,
        points: Number
    }
});

module.exports = Player = mongoose.model('players', PlayerSchema);