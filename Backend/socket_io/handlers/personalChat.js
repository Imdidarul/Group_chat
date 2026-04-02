const messageController = require("../../controller/messageController")

module.exports = (socket,io) => {
    socket.on("join-room", (roomId)=>{
        socket.join(roomId)
        socket.roomId = roomId
        console.log(`User ${socket.user.userName} joined room ${roomId}`)
    })
    
    socket.on("sendMessage",(data)=>{
        // io.emit("new-message", {username: socket.user.username, data})
        messageController.addMessage(socket,data)
    })

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id)
        // clients = clients.filter(c => c.id !== socket.id)
    })
}