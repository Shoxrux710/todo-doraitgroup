const { Router } = require('express')
const isAuthMiddleware = require('../middleware/isAuth');
const attachUserMiddleware = require('../middleware/attachUser');
const checkRoleMiddleware = require('../middleware/checkRole');
const { validationResult } = require('express-validator')
const { roomValidator } = require('../utils/validator')
const Room = require('../models/Room')
const Group = require('../models/Group')
const router = Router()


// room post
router.post('/', roomValidator, (req, res) => {
    console.log(req.body)
    console.log(req.files)

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), errorMessage: `Group nomini kiriting` })
    }
    const { name } = req.body
    const { filename } = req.files.groupImage[0]

    const array = req.body.array.split(',')

    console.log(array)

    const room = new Room({
        name,
        array,
        groupImage: {
            fileName: filename,
            fileUrl: `./group/${filename}`
        }
    })

    room.save(err => {
        if (err) return res.status(400).json({ errorMessage: `Iltimos to'ldiring` })
        res.status(200).json({ successMessage: "Group yaratildi" })
    })
})

router.get('/', isAuthMiddleware, attachUserMiddleware, checkRoleMiddleware('admin'), async (req, res) => {

    const { id } = req.user


    const group = await Room.find({
        array: { $in: [id] }
    })

    res.status(200).json({ group })


})

// delete

router.delete('/delete/:id', async (req, res) => {

    const { id } = req.params


    await Room.deleteOne({ _id: id })
    await Group.deleteMany({ members: { $in: [id] } })
    res.status(200).json({ successMessage: "Delete" })


})

// put

router.put('/update', (req, res) => {

})


module.exports = router