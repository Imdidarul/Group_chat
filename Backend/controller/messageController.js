// const User = require("../model/user")
// const Message = require("../model/message")

const {User, Message} = require("../model")
let broadcast

const setBroadcast = (fn)=>{
    broadcast = fn
}

const addMessage = async(req,res)=>{
    try {
        const {userId, messageContent} = req.body

        const user = await User.findByPk(userId)

        const newMsg = await Message.create({
            userId,
            messageContent
        })

        if (broadcast){
            broadcast({
                id:newMsg.id,
                userId: newMsg.userId,
                userName: user.name,
                messageContent: newMsg.messageContent,
                createdAt: newMsg.createdAt
            })
        }
        // broadcast(newMsg)
        // await Message.create({
        //     userId:userId,
        //     messageContent: messageContent
        // })

        res.status(200).json("Message sent")
    } catch (error) {
        res.status(500).send(error.message)
    }
}

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


module.exports = {addMessage,getMessages, setBroadcast}