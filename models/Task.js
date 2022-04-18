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
        required: true
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
        type: Array
    },
    endDate: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: new Date()
    },
    status: {
        type: String,
        enum: ['one', 'two', 'three', 'four'],
        default: 'one'
    }
})

module.exports = model('Task', taskSchema)