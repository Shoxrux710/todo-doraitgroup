const express = require('express')
require('express-async-errors')
const http = require('http')
const { Server } = require('socket.io')
const mongoose = require('mongoose')
const middleware = require('./middleware/file')
const cors = require('cors')
const Login = require('./models/Login')
const bcrypt = require('bcryptjs')


const app = express()


// routes
const loginRouter = require('./routes/Login')
const groupRouter = require('./routes/Group')
const messageRouter = require('./routes/Message')
const roomRouter = require('./routes/Room')
const userRouter = require('./routes/User')
const taskRouter = require('./routes/Task')

app.use(express.json({ extends: true }))
app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: '*'
    }
})



io.on('connection', (socket) => {

    console.log("user connect");
    socket.on("join_room", (data) => {
        socket.join(data)
        console.log(`User with ID: ${socket.id} joined room ${data}`)
    })

    // socket.on("join_user", (data) => {
    //     socket.join(data)
    //     addUser(data)
    //     console.log(`User with ID: ${socket.id} joined room ${data}`)
    // })

    socket.on("send_message", (data) => {
        
        console.log(data)
        socket.to(data.members[1]).emit("receive_message", data)
    })
    socket.on("send_delete", async ({data, id}) => {

        await Message.deleteOne({_id: id})
        // console.log(data)
        // await socket.to(id).emit("receive_delete", data)
    })

    // socket.on("user_message", (data) => {
    //     console.log(data)
    //     console.log("user", users)
    //     const user = getUser(data.members[1])
    //     console.log("1", user)
    //     socket.to(user).emit("receive_message", data)
    // })

    

    // socket.on("addUser", userId => {
    //     addUser(userId, socket.id)  
    //     io.emit("getUsers", users)
    // })

    // socket.on("sendMessage", ({otherId, messages}) => {
    //     const user = getUser(otherId)
    //     io.to(user.socketId).emit("get_message", messages)
    // })

    socket.on('disconnect', () => {
        console.log("User disconnected", socket.id);
     
    })

})


app.use(middleware.fields([
    { name: 'avatar', maxCount: 1 }
]))

app.use('/api/user', loginRouter)
app.use('/api/group/', groupRouter)
app.use('/api/message/', messageRouter)
app.use('/api/room/', roomRouter)
app.use('/api/users/', userRouter)
app.use('/api/task/', taskRouter)
app.use(function (errorMessage, req, res, next) {
    res.status(400).json(`Serverda xato ${errorMessage}`)
})


const PORT = 4005

async function start() {

    await mongoose.connect("mongodb://localhost:27017,localhost:27018,localhost:27019/chat",
        { useNewUrlParser: true, useUnifiedTopology: true, replicaSet: 'myReplicaSet' })

    const admin = await Login.findOne()

    if (!admin) {
        const passwordHashed = await bcrypt.hash('123456', 12)

        const user = new Login({
            name: 'Shavkat',
            login: 'dora123',
            password: passwordHashed,
            role: 'super-admin'
        })

        await user.save()
    }


    console.log("mongodb online")
    server.listen(PORT, () => console.log(`server running ${PORT}`))

}

start()

