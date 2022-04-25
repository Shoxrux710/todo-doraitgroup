const { Router } = require('express')
const isAuthMiddleware = require('../middleware/isAuth');
const attachUserMiddleware = require('../middleware/attachUser');
const checkRoleMiddleware = require('../middleware/checkRole');
const { validationResult } = require('express-validator')
const { userValidator } = require('../utils/validator')
const User = require('../models/User')
const Message = require('../models/Message')
const router = Router()


// post
router.post('/', userValidator, (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), errorMessage: `User nomini kiriting` })
    }

    const { array, name, username } = req.body

    const users = new User({ array, name, username })

    users.save(err => {
        if (err) return res.status(400).json({ errorMessage: `Iltimos to'ldiring` })
        res.status(200).json({ successMessage: "User yaratildi" })
    })
})

router.get('/', isAuthMiddleware, attachUserMiddleware, checkRoleMiddleware('user'), async (req, res) => {

    const { id } = req.user

    const users = await User.find({
        array: { $in: [id] }
    })

    res.status(200).json({ users })


})

// delete
router.delete('/delete/:usersId', async (req, res) => {

    const { usersId } = req.params

    await User.deleteOne({ _id: usersId })
    await Message.deleteMany({ members: { $in: [usersId] } })
    res.status(200).json({ successMessage: "Delete" })

})





module.exports = router