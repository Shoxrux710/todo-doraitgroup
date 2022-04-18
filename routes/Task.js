const Router = require('express')
const isAuthMiddleware = require('../middleware/isAuth');
const attachUserMiddleware = require('../middleware/attachUser');
const checkRoleMiddleware = require('../middleware/checkRole');
const { validationResult } = require('express-validator')
const { taskValidator } = require('../utils/validator')
const Task = require('../models/Task');
const router = Router()




router.post('/', isAuthMiddleware, attachUserMiddleware, checkRoleMiddleware('admin'), taskValidator, (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), errorMessage: `Iltimos to'ldiring` })
    }

    const task = new Task(req.body)

    task.save(err => {
        if (err) return res.status(400).json({ errors: errors.array(), errorMessage: `Xato` })
        res.status(200).json({ successMessage: 'Vazifa kiritildi' })
    })

})


router.get('/', async (req, res) => {

    const taskOne = await Task.find({ status: 'one' })
    const taskTwo = await Task.find({ status: 'two' })
    const taskThree = await Task.find({ status: { $in: ['three', 'four'] } })
    res.status(200).json({
        taskOne,
        taskTwo,
        taskThree
    })
})

router.get('/userId/:id', async (req, res) => {

    const { id } = req.params

    const userId = await Task.findById({ _id: id })
    res.status(200).json({ userId })
})

router.delete('/delete/:id', isAuthMiddleware, attachUserMiddleware, checkRoleMiddleware('admin'), async (req, res) => {

    const { id } = req.params

    await Task.deleteOne({ _id: id })
    res.status(200).json({ successMessage: `O'chirildi` })

})


router.put('/update/', isAuthMiddleware, attachUserMiddleware, checkRoleMiddleware('admin'), async (req, res) => {

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

router.put('/reject/', isAuthMiddleware, attachUserMiddleware, checkRoleMiddleware('admin'), (req, res) => {

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


router.put('/all/:id', isAuthMiddleware, attachUserMiddleware, checkRoleMiddleware('admin'), (req, res) => {

    const { id } = req.params

    const {
        title,
        description,
        group,
        taskArray,
        array,
        endDate,
    } = req.body

    Task.findById(id, (err, oneTask) => {
        if (err) return res.status(400).json({ errorMessage: "Xato" })

        oneTask.title = title
        oneTask.description = description
        oneTask.group = group
        oneTask.endDate = endDate
        oneTask.array = array
        oneTask.taskArray = taskArray


        oneTask.save(err => {
            if (err) return res.status(400).json({ errorMessage: "Xato" })
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