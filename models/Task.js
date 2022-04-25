const {Schema, model} = require('mongoose')

const taskSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    group: {
        type: String,
        default: null
    },
    taskArray: [
        {
            text: String,
            isClick: {
                type: Boolean,
                default: false
            }
        }
    ],
    array: {
        type: Array,
        required: true
    },
    date: {
        type: Date
    },
    status: {
        type: String,
        enum: ['one', 'two', 'three', 'four'],
        default: 'one'
    },
    didline: {
        isDidline: {
            type: Boolean,
            default: false
        },
        didlineDate: {
            type: Date,
            required: true
        }
    }
})

module.exports = model('Task', taskSchema)