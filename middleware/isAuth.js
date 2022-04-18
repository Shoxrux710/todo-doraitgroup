const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {


    const authHeader = req.headers.authorization

    if (!req.headers.authorization) return res.sendStatus(401)

    const token = authHeader.split(' ')[1]


    if (!token) return res.sendStatus(401)

    jwt.verify(token, 'LIKMEKLSMDVLSKDMVOMVL', (err, user) => {
        if (err) return res.sendStatus(403);
        req.decodedUser = {id: user.id}
        next()
    })
}