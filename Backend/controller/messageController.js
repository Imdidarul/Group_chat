// const User = require("../model/user")
// const Message = require("../model/message")

const {User, Message} = require("../model")
let ioInstance

const initSocket = (io)=>{
    ioInstance = io
}

const addMessage = async(socket, data)=>{
    try {
        // const {userId, messageContent} = req.body
        const userId = socket.user.id
        const messageContent = data.messageContent

        // const user = await User.findByPk(userId)

        const newMsg = await Message.create({
            userId,
            messageContent
        })

        const messageData = {
                id:newMsg.id,
                userId: socket.user.id,
                userName: socket.user.name,
                messageContent: newMsg.messageContent,
                createdAt: newMsg.createdAt
        }

        ioInstance.emit("Message",messageData)
        // broadcast(newMsg)
        // await Message.create({
        //     userId:userId,
        //     messageContent: messageContent
        // })
    } catch (error) {
        console.log(error)
        // res.status(500).send(error.message)
    }
}


// socket.on("sendMessage", async (messageContent)=>{
//     try {
//         const newMsg = await Message.create({
//             userId: socket.user.id,
//             messageContent
//         })

//         const data = {
//             id: newMsg.id,
//             userId: socket.user.id,
//             userName: socket.user.name,
//             messageContent: newMsg.messageContent,
//             createdAt: newMsg.createdAt
//         };

//         io.emit("Message", data);
//     } catch (error) {
        
//     }
// })

const getMessages = async(req,res)=>{
    try {
        // const user = await User.findByPk(userId)
        const messages = await Message.findAll({
            include:[{
                model:User,
                attributes:['name']
            }],
            order:[['createdAt', 'ASC']]
        })
        // console.log(messages[1])
        res.status(200).send({messages:messages})
    } catch (error) {
        res.status(500).send(error.message)
    }
}


module.exports = {addMessage, getMessages,initSocket}