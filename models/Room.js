const { Schema, model } = require('mongoose');


const roomSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    array: {
        type: Array,
        required: true
    },
    date: {
        type: Date,
        default: new Date()
    },
    groupImage: {
        fileName: {
            type: String,
            required: true
        },
        fileUrl: {
            type: String,
            required: true
        }
    }
})

module.exports = model('Room', roomSchema)