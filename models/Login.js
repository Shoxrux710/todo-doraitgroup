const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    login: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['super-admin', 'admin', 'user'],
        default: 'user'
    },
    password: {
        type: String,
        required: true,
        minlength: 4
    },
    avatar: {
        fileName: {
            type: String,
            default: null
        }
    }
})

module.exports = mongoose.model('Login', adminSchema)