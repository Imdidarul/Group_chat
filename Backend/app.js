const express = require("express")
const app = express()
require('dotenv').config()
require("./model")
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
const server = http.createServer(app)
// const wss = new WebSocket.Server({server})

// const logStream = fs.createWriteStream(
//     path.join(__dirname,'tmp/access.log'),
//     {flags: 'a'}
// );

const io = new Server(server,{
    cors:{
        origin:"*"
    }
})



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


let clients = []

io.on("connection", (socket) => {
    console.log("User connected",socket.id);
    clients.push(socket)

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id)
        clients = clients.filter(c => c.id !== socket.id)
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

const broadcastMessage = (data)=>{
    clients.forEach(client=>{
            client.emit("Message",data)
        })
}


messageController.setBroadcast(broadcastMessage)


db.sync({alter: true}).then(()=>{
    server.listen(process.env.PORT || 3000,(err)=>{
        console.log("Server is running")
    })
}).catch((err)=>{
    console.log("Unable to connect to server")
})