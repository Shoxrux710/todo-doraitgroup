const { Schema, model } = require('mongoose');


const messageSchema = new Schema({
    members: {
        type: Array,
    }, 
    text: {
        type: String,
    },   
    date: {
        type: Date,  
    },
    userImages: {
        type: String
    },
    view: {
        type: Number,
        default: 0
    }
    
})

module.exports = model('Message', messageSchema)