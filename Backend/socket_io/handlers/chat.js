const messageController = require("../../controller/messageController")

module.exports = (socket,io) => {
    socket.on("sendMessage",(data)=>{
        messageController.addMessage(socket,data)
    })

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id)
        // clients = clients.filter(c => c.id !== socket.id)
    })
}