const { Router } = require('express')
const isAuthMiddleware = require('../middleware/isAuth');
const attachUserMiddleware = require('../middleware/attachUser');
const checkRoleMiddleware = require('../middleware/checkRole');
const Group = require('../models/Group')
const router = Router()


// post
router.post('/', isAuthMiddleware, attachUserMiddleware, checkRoleMiddleware('admin'), (req, res) => {

    const { members, text, date, name, userImages } = req.body
    // const {filename} = req.files.roomImage[0]
    console.log(req.body)

    const group = new Group({
        text,
        members,
        date,
        userImages,
        name
    })

    group.save(err => {
        if (err) return res.status(400).json({ errorMessage: "Xato" })
        res.status(200).json({ successMessage: "Ok" })
    })
})

router.get('/', async (req, res) => {

    const { otherId } = req.query

    const groups = await Group.find({ members: { $in: [otherId] } })
    res.status(200).json({ groups })

})

module.exports = router