const { Schema, model } = require('mongoose');


const groupSchema = new Schema({ 
    members: {
        type: Array
    }, 
    text: {
        type: String,
        default: null
    },
    name: {
        type: String
    },
    userImages: {
        type: String
    },
    date: {
        type: Date
    }
})

module.exports = model('Group', groupSchema)