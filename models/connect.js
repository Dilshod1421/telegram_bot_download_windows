const { Schema, model } = require('mongoose');

const BotSchema = Schema({
    userId: { type: Number, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    username: { type: String, required: true },
});

const UsersBot = model('UsersBot', BotSchema);
module.exports = UsersBot;