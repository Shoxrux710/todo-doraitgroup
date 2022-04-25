
module.exports = (role) => {

    return (req, res, next) => {

        if (req.user.role === role || req.user.role === 'super-admin' || req.user.role === 'admin'){
            next()
        }else{
            return res.sendStatus(403)
        }
    }
}