const {body} = require('express-validator')


exports.authValidator = [
    body('login').isLength({min: 1}),
    body('password').isLength({min: 1})
]


exports.registerValidator = [
    body('name').isLength({min: 1}),
    body('login').isLength({min: 1}),
    body('password').isLength({min: 1}),
]

exports.roomValidator = [
    body('name').isLength({min: 1}),
    body('array').isLength({min: 1})
]
exports.userValidator = [
    body('name').isLength({min: 1}),
    body('array').isLength({min: 1}),
    body('username').isLength({min: 1})
]

exports.taskValidator = [
    body('title').isLength({min: 1}),
    body('description').isLength({min: 1}),
    body('didlineDate').isLength({min: 1}),
    body('taskArray').isLength({min: 1}),
    body('array').isLength({min: 1}),   
    
]