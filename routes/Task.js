const Router = require('express')
const isAuthMiddleware = require('../middleware/isAuth');
const attachUserMiddleware = require('../middleware/attachUser');
const checkRoleMiddleware = require('../middleware/checkRole');
const { validationResult } = require('express-validator')
const { taskValidator } = require('../utils/validator')
const nowDate = require('../utils/nowDate')
const Task = require('../models/Task');
const router = Router()


router.post('/', isAuthMiddleware, attachUserMiddleware, checkRoleMiddleware('user'), taskValidator, (req, res) => {


    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), errorMessage: `Iltimos to'ldiring` })
    }

    const {
        title,
        description,
        group,
        taskArray,
        array,
        didlineDate,
        status
    } = req.body

    const { date } = nowDate()

    const task = new Task({
        title,
        description,
        group,
        taskArray,
        array,
        didline: {
            didlineDate
        },
        status,
        date
    })

    task.save(err => {
        if (err) return res.status(400).json({ errorMessage: `Xato` })
        res.status(200).json({ successMessage: 'Vazifa kiritildi' })
    })

})


router.get('/', isAuthMiddleware, attachUserMiddleware, checkRoleMiddleware('user'), async (req, res) => {


    const { groupName } = req.query
    const { id, role } = req.user

    console.log("group", groupName)

    const filterArray = role === 'user' ? {array: { $in: [id] }} : {}

    const taskOne = await Task.find({ status: 'one', group: groupName, ...filterArray })
    const taskTwo = await Task.find({ status: 'two', group: groupName, ...filterArray })
    const taskThree = await Task.find({ status: { $in: ['three', 'four'] }, group: groupName, ...filterArray })
    const taskGroup = await Task.find({ group: { $nin: [''] }, ...filterArray })


    res.status(200).json({
        taskOne,
        taskTwo,
        taskThree,
        taskGroup
    })
})

router.get('/navbar/', isAuthMiddleware, attachUserMiddleware, checkRoleMiddleware('user'), async (req, res) => {

    const { userId } = req.query
    const { role } = req.user
    const { date, month, day, year } = nowDate()

    const endDate = new Date(Date.UTC(year, month - 1, day + 29))
    const startDate = date
    const filterBoolean = role === 'user' ? {array: { $in: [userId] }} : {}

    const didlineTask = await Task.find({'didline.didlineDate': {$gte: startDate,$lte: endDate},'didline.isDidline': false, ...filterBoolean})

    res.status(200).json({ didlineTask })

})

router.get('/userId/:id', async (req, res) => {

    const { id } = req.params

    const userId = await Task.findById({ _id: id })
    res.status(200).json({ userId })
})



router.delete('/delete/:id', isAuthMiddleware, attachUserMiddleware, checkRoleMiddleware('user'), async (req, res) => {

    const { id } = req.params

    await Task.deleteOne({ _id: id })
    res.status(200).json({ successMessage: `O'chirildi` })

})


router.put('/update/', isAuthMiddleware, attachUserMiddleware, checkRoleMiddleware('user'), async (req, res) => {

    const { color, id } = req.body

    let oneColor = color === 'one' ? 'two' : (color === 'two' ? 'three' : 'four')
    let isFalse = oneColor === 'four' ? true : false

    // console.log(oneColors)
    console.log(isFalse)


    Task.findById(id, (err, oneTask) => {
        if (err) return res.status(400).json({ errorMessage: "Xato" })

        oneTask.status = oneColor
        isFalse ? oneTask.didline.isDidline = true : ''

        oneTask.save(err => {
            if (err) return res.status(400).json({ errorMessage: "Xato" })
            res.status(200).json({ successMessage: 'Bajarildi' })
        })
    })

})

router.put('/reject/', isAuthMiddleware, attachUserMiddleware, checkRoleMiddleware('user'), (req, res) => {

    const { id } = req.body

    Task.findById(id, (err, oneTask) => {
        if (err) return res.status(400).json({ errorMessage: "Xato" })

        oneTask.status = 'two'

        oneTask.save(err => {
            if (err) return res.status(400).json({ errorMessage: "Xato" })
            res.status(200).json({ successMessage: 'Rad etildi' })
        })
    })
})


router.put('/all/:id', isAuthMiddleware, attachUserMiddleware, checkRoleMiddleware('user'), (req, res) => {

    const { id } = req.params

    const {
        title,
        description,
        group,
        taskArray,
        array,
        didlineDate
    } = req.body

    console.log(req.body)

    Task.findById(id, (err, oneTask) => {
        if (err) return res.status(400).json({ errorMessage: "Xato" })

        oneTask.title = title
        oneTask.description = description
        oneTask.group = group
        oneTask.taskArray = taskArray
        oneTask.didline = {
            isDidline: false,
            didlineDate
        }
        oneTask.array = array

        oneTask.save(err => {
            if (err) return res.status(400).json({ errorMessage: `Xato ${err}` })
            res.status(200).json({ successMessage: "Yangilandi" })
        })

    })
})


module.exports = router