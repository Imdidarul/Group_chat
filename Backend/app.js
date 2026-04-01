const express = require("express")
const app = express()
require('dotenv').config()
require("./model")
const {User} = require("./model")
const {Server} = require("socket.io")
const db = require("./utils/dbConnection")
const cors = require("cors")
const http = require("http")
// const WebSocket = require("ws")
const fs = require("fs")
const path = require("path")
const userRoute = require("./routes/userRoute")
const messageRoute = require("./routes/messageRoute")
const messageController = require("./controller/messageController")
const jwt = require("jsonwebtoken")
const server = http.createServer(app)
// const wss = new WebSocket.Server({server})

// const logStream = fs.createWriteStream(
//     path.join(__dirname,'tmp/access.log'),
//     {flags: 'a'}
// );

const io = new Server(server,{
    cors:{
        origin: "*"
        // origin: process.env.NODE_ENV === "production" ? false : ["http://localhost:3000", "http://localhost:5500"]
    }
})
messageController.initSocket(io)


app.use(cors())
app.use(express.json())
// app.use(helemt())
// app.use(morgan('combined', {stream: logStream}))

app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
  });
app.use("/user",userRoute)
app.use("/message",messageRoute)


app.use((err, req, res, next) => {
    console.error("GLOBAL ERROR:", err.message);
    console.error(err.stack);

    res.status(500).json({
        message: "Something went wrong",
        error: err.message
    });
});


// let clients = []


io.use(async (socket, next)=>{
    try{
        const token = socket.handshake.auth.token
        if (!token){
            return next(new Error("Authorization token is missing!"))
        }
        const extracted = jwt.verify(token, process.env.AUTH_SECRET_KEY)
        const userid = extracted.userId

        if (!extracted){
            return next(new Error("Invalid token!"))
        }

        const user = await User.findByPk(userid)
        if(!user){
            return next(new Error("User not found"))
        }
        // req.user = user
        socket.user = user
        next()
}catch (error) {
    console.log(error.message)
    return next(new Error("Server error"))
}
})

io.on("connection", (socket) => {
    console.log("User connected",socket.id);
    // clients.push(socket)

    socket.on("sendMessage",(data)=>{
        messageController.addMessage(socket,data)
    })

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id)
        // clients = clients.filter(c => c.id !== socket.id)
    })

  });

// wss.on("connection", (ws)=>{
//     console.log("New client connected")

//     clients.push(ws)

//     ws.on("close", ()=>{
//         console.log("Client disconnected")
//         clients = clients.filter(client=> client!== ws)
//     })
// })

// const broadcastMessage = (data)=>{
//     clients.forEach(client=>{
//             client.emit("Message",data)
//         })
// }


// messageController.setBroadcast(broadcastMessage)


db.sync({alter: true}).then(()=>{
    server.listen(process.env.PORT || 3000,(err)=>{
        console.log("Server is running")
    })
}).catch((err)=>{
    console.log("Unable to connect to server")
})