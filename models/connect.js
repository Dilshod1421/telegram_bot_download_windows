const { Schema, model } = require('mongoose');

const BotSchema = Schema({
    userId: { type: Number, required: true },
    first_name: { type: String },
    last_name: { type: String },
    username: { type: String },
    month: { type: String },
    day: { type: String },
    year: { type: String }
});

const UsersBot = model('UsersBot', BotSchema);
module.exports = UsersBot;