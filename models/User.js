const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    array: {
        type: Array,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: new Date()
    }
})

module.exports = model('User', userSchema)