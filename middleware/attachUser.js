const Login = require('../models/Login')


module.exports = (req, res, next) => {
    Login.findOne({_id: req.decodedUser.id}, (err, user) => {
        if (err) return res.sendStatus(500);

        if (!user) return res.sendStatus(401)

        req.user = user
        next();
    })
}