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
    }
    
})

module.exports = model('Message', messageSchema)