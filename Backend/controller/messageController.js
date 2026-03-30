const User = require("../model/user")
const Message = require("../model/message")

const addMessage = async(req,res)=>{
    try {
        const {userId, messageContent} = req.body
        await Message.create({
            userId:userId,
            messageContent: messageContent
        })

        res.status(200).json("Message sent")
    } catch (error) {
        res.status(500).send(error.message)
    }
}

module.exports = {addMessage}