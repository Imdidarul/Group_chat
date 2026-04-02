const {Server} = require("socket.io")
const socketAuth = require("./middleware")
const chatHandler = require("./handlers/personalChat")
const messageController = require("../controller/messageController")
module.exports = (server) => {
    const io = new Server(server,{
        cors:{
            origin: "*"
            // origin: process.env.NODE_ENV === "production" ? false : ["http://localhost:3000", "http://localhost:5500"]
        }
    })
    socketAuth(io)

    io.on("connection", (socket) => {
        console.log("User connected",socket.id);
        messageController.initSocket(io)
        chatHandler(socket, io)
    
      });

    // return io
}