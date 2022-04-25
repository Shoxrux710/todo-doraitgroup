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
        didline,
        status
    } = req.body

    const { date } = nowDate()

    const task = new Task({
        title,
        description,
        group,
        taskArray,
        array,
        didline,
        status,
        date
    })

    task.save(err => {
        if (err) return res.status(400).json({ errorMessage: `Xato ${err}` })
        res.status(200).json({ successMessage: 'Vazifa kiritildi' })
    })

})


router.get('/', isAuthMiddleware, attachUserMiddleware, checkRoleMiddleware('user'), async (req, res) => {


    const { groupName } = req.query
    const { id } = req.user

    console.log("group", groupName)

    const taskOne = await Task.find({ status: 'one', group: groupName, array: { $in: [id] } })
    const taskTwo = await Task.find({ status: 'two', group: groupName, array: { $in: [id] } })
    const taskThree = await Task.find({ status: { $in: ['three', 'four'] }, group: groupName, array: { $in: [id] } })
    const taskGroup = await Task.find({ group: { $nin: [''] }, array: { $in: [id] } })

    res.status(200).json({
        taskOne,
        taskTwo,
        taskThree,
        taskGroup
    })
})

router.get('/admin', isAuthMiddleware, attachUserMiddleware, checkRoleMiddleware('user'), async (req, res) => {

    const { groupName } = req.query

    const taskOne = await Task.find({ status: 'one', group: groupName })
    const taskTwo = await Task.find({ status: 'two', group: groupName })
    const taskThree = await Task.find({ status: { $in: ['three', 'four'] }, group: groupName })
    const taskGroup = await Task.find({ group: { $nin: [''] } })

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
    console.log(date)

    const endDate = new Date(Date.UTC(year, month - 1, day + 29))
    const startDate = date
    console.log(endDate)

    const didlineUser = await Task.find({
        'didline.didlineDate': {
            $gte: startDate,
            $lte: endDate
        },
        'didline.isDidline': false,
        array: { $in: [userId] }
    })

    const didlineAdmin = await Task.find({
        'didline.didlineDate': {
            $gte: startDate,
            $lte: endDate
        },
        'didline.isDidline': false
    })

    const didlineTask = role === 'user' ? didlineUser : didlineAdmin
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

    console.log(oneColor)
    console.log(id)

    Task.findById(id, (err, oneTask) => {
        if (err) return res.status(400).json({ errorMessage: "Xato" })

        oneTask.status = oneColor

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
        endDate,
    } = req.body

    console.log(endDate)

    Task.findById(id, (err, oneTask) => {
        if (err) return res.status(400).json({ errorMessage: "Xato" })

        oneTask.title = title
        oneTask.description = description
        oneTask.group = group
        oneTask.taskArray = taskArray
        oneTask.endDate = endDate
        oneTask.array = array

        oneTask.save(err => {
            if (err) return res.status(400).json({ errorMessage: `Xato ${err}` })
            res.status(200).json({ successMessage: "Yangilandi" })
        })

    })
})

// router.put('/array/', isAuthMiddleware, attachUserMiddleware, checkRoleMiddleware('admin'), async (req, res) => {

//     const { id, taskId } = req.body
//     console.log(taskId)


//     Task.findById(taskId, (err, oneTask) => {
//         if (err) return res.status(400).json({ errorMessage: "Xato" })

//         for (let i = 0; i < oneTask.taskArray.length; i++) {

//             if (oneTask.taskArray[i]._id.toString() === id){
//                 oneTask.taskArray[i].isClick = !oneTask.taskArray[i].isClick
//             }
//         }

//         oneTask.save(err => {
//             if (err) return res.status(400).json({ errorMessage: "Xato" })
//             res.status(200).json({ successMessage: "Bajarildi" })
//         })
//     })


// })


module.exports = router