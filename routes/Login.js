const { Router } = require('express')
const { validationResult } = require('express-validator')
const { authValidator } = require('../utils/validator')
const { registerValidator } = require('../utils/validator')
const Login = require('../models/Login')
const jwt = require('jsonwebtoken')
const isAuthMiddleware = require('../middleware/isAuth')
const attachUserMiddleware = require('../middleware/attachUser')
const checkRoleMiddleware = require('../middleware/checkRole')
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs')
const config = require('config')
const router = Router()

const deleteOldImage = (fileName) => {
    return new Promise((resolve, reject) => {
        fs.unlink(path.join(__dirname, `../admin/${config.get('imgFolder')}/avatar/${fileName}`), (err) => {
            resolve()
        })
    })

}

// register
router.post('/register', registerValidator, async (req, res) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), errorMessage: `Iltimos to'ldiring` })
    }

    const { name, login, password } = req.body

    const user = await Login.findOne({ login })

    if (user) {
        return res.status(400).json({ errorMessage: "User already" })
    }

    const passwordHashed = await bcrypt.hash(password, 12)

    const newUser = new Login({
        name,
        login,
        password: passwordHashed
    })

    const userId = await newUser.save()

    const payload = {
        id: userId._id,
    }

    const token = jwt.sign(payload, config.get('jsonwebtoken'));

    res.status(200).json({
        successMessage: "Register success",
        token,
        role: userId.role,
        id: userId._id
    })

})

// login

router.post('/login', authValidator, async (req, res) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), errorMessage: `Iltimos to'ldiring` })
    }
    const { login, password } = req.body

    const user = await Login.findOne({ login })
    if (!user) {
        return res.status(400).json({ errorMessage: "Please login..." })
    }
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        return res.status(400).json({ errorMessage: "inCorrect password" })
    }

    const payload = {
        id: user._id
    }

    const token = jwt.sign(payload, config.get('jsonwebtoken'));

    res.status(200).json({
        token,
        msg: "User Loggedin Succesfully",
        role: user.role,
        id: user._id
    })

})

router.get('/date', isAuthMiddleware, attachUserMiddleware, checkRoleMiddleware('user'), (req, res) => {
    res.status(200).json({
        user: req.user
    })
})

router.get('/all', async (req, res) => {

    const skip = req.query.skip ? Number(req.query.skip) : 0
    const limit = req.query.limit ? Number(req.query.limit) : 0

    const userCount = await Login.countDocuments()
    const users = await Login.find()

    res.status(200).json({
        userCount,
        users
    })

})

router.get('/other', isAuthMiddleware, attachUserMiddleware, checkRoleMiddleware('user'), async (req, res) => {

    const {id} = req.user

    const user = await Login.find({
        _id: { $nin: [id] }
    })
    res.status(200).json({ user })

})

router.get('/query', async (req, res) => {
    const { userId } = req.query


    const user = await Login.findById(userId)
    res.status(200).json(user)

})

router.put('/admin', isAuthMiddleware, attachUserMiddleware, checkRoleMiddleware('user'), (req,res) => {

    const {id} = req.body

    console.log(id)

    Login.findById(id, (err, oneUser) => {
        if (err) return res.status(400).json({errorMessage: "Xato"})

        const roles = oneUser.role === 'user' ? 'admin' : 'user'
        oneUser.role = roles

        oneUser.save(err => {
            if (err) return res.status(400).json({errorMessage: "Xato"})
            res.status(200).json({successMessage: `admin bo'ldi`})
        })
    })
})

// profile update
router.put('/avatar/:id', (req, res) => {

    const { id } = req.params

    Login.findById(id, (err, user) => {
        if (err) res.status(400).json({ errorMessage: "Nimadur xato" })

        const { avatar } = user
        const oldFileName = avatar.fileName
        console.log(req.files)

        const fileName = req.files.avatar ? req.files.avatar[0].filename : oldFileName

        user.avatar = {
            fileName: fileName,
            fileUrl: `./avatar/${fileName}`
        }

        user.save(async (err) => {
            if (err) return res.status(400).json({ errorMessage: "Xato" });
            req.files.avatar ? await deleteOldImage(oldFileName) : null
            res.status(200).json({ successMessage: "rasm quyildi", user })
        })
    })


})

module.exports = router