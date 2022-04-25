const {Router} = require('express')
const isAuthMiddleware = require('../middleware/isAuth');
const attachUserMiddleware = require('../middleware/attachUser');
const checkRoleMiddleware = require('../middleware/checkRole');
const Message = require('../models/Message')
const router = Router()

// add

router.post('/', isAuthMiddleware, attachUserMiddleware, checkRoleMiddleware('user'), (req, res) => {

    const {text, members, date, userImages} = req.body
    // const {imageMessage} = req.files

    console.log(req.body)
    console.log(req.files)

    const messageNew = new Message({
        text, 
        date,
        members,     
        userImages
    })

    messageNew.save(err => {
        if (err) return res.status(400).json({errorMessage: "Xato"})
        res.status(200).json({successMessage: "Ok"})
    })
})

router.post('/upload', isAuthMiddleware, attachUserMiddleware, checkRoleMiddleware('user'), (req, res) => {

    const { members, date} = req.body
    // const {imageMessage} = req.files

    // console.log(req.body)
    console.log(req.files)
    const {filename} = req.files.imageMessage[0]

    const messageNew = new Message({
        date,
        members,
        imageMessage: {
            fileName: filename,
            fileUrl: `./message/${filename}`
        }        
    })

    messageNew.save(err => {
        if (err) return res.status(400).json({errorMessage: "Xato"})
        res.status(200).json({successMessage: "Ok"})
    })
})

// get message room
router.get('/users', isAuthMiddleware, attachUserMiddleware, checkRoleMiddleware('user'), async (req, res) => {

    const {otherId} = req.query   

    try {
        const user = await Message.find({members: {$in: [otherId]}})

        res.status(200).json({user})
    } catch (err) {
        console.log(err);
    }
})
router.get('/other', async (req, res) => {

    const {messageId} = req.query   

    try {
        const user = await Message.find({_id: {$nin: [messageId]}})

        res.status(200).json({user})
    } catch (err) {
        console.log(err);
    }
})

// delete

router.delete('/delete/:id', async (req, res) => {
    
    const {id} = req.params

    try{
        await Message.deleteOne({_id: id})
        res.status(200).json({successMessage: "Delete"})
    }catch(e){
        res.status(200).json({errorMessage: "Xato"})
    }
})

router.put('/view/:id', (req,res) => {
     
    const {id} = req.params

    Message.findById(id, (err, oneMessage) => {
        if (err) return res.status(400).json({errorMessage: "Xato"})

        const view = oneMessage.view + 1

        oneMessage.view = view

        oneMessage.save(err => {
            if (err) return res.status(400).json({errorMessage: "Xato"})
            res.status(200).json({successMessage: `Ko'rildi`, view})
        })

    })


})

module.exports = router