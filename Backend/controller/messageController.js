    // const User = require("../model/user")
    // const Message = require("../model/message")
    const AWS = require("aws-sdk")

    const {User, Message} = require("../model")
    let ioInstance

    const initSocket = (io)=>{
        ioInstance = io
    }

    const status = async (socket, status,roomId)=>{
        // console.log(roomId)
        try {
            if (!roomId){
                return
            }
            socket.to(roomId).emit("receive-status",{status,roomId})
        } catch (error) {
            
        }
    }

    const addMessage = async(socket, data)=>{
        try {
            // const {userId, messageContent} = req.body
            const userId = socket.user.id
            const messageContent = data.messageContent
            const isInRoom = !!socket.roomId
            let roomId = isInRoom ? socket.roomId : "broadcast"
            const type = data.type || "text"

            // const user = await User.findByPk(userId)

            const newMsg = await Message.create({
                userId,
                type,
                messageContent,
                roomId
            })

            const messageData = {
                    id:newMsg.id,
                    userId: socket.user.id,
                    userName: socket.user.name,
                    messageContent: newMsg.messageContent,
                    type: newMsg.type,
                    createdAt: newMsg.createdAt,
                    roomId
            }

            if (!isInRoom){
                ioInstance.emit("Message", messageData)
            }else{
            ioInstance.to(roomId).emit("Message",messageData)
            }

            // ioInstance.emit("Message",messageData)
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

    const getName = async(req,res) =>{
        try {
            // console.log("Inside getName")
            const {userPhone} = req.query
            // console.log(userPhone)
            const user = await User.findOne({
                where:{phoneno: userPhone}
            })
            res.json({name:user.name})   
        } catch (error) {
            console.log(error)
        }
    }

    const getMessages = async(req,res)=>{
        try {
            // const user = await User.findByPk(userId)
            let {roomId} = req.query
            if (!roomId){
                roomId = "broadcast"
                const messages = await Message.findAll({
                    where:{roomId},
                    include:[{
                        model:User,
                        attributes:['name']
                    }],
                    order:[['createdAt', 'ASC']]
                })
                res.status(200).send({messages:messages})
            }
            else{
            const messages = await Message.findAll({
                where:{roomId},
                include:[{
                    model:User,
                    attributes:['name']
                }],
                order:[['createdAt', 'ASC']]
            })
            res.status(200).send({messages:messages})
            }
            // console.log(messages[1])
        } catch (error) {
            res.status(500).send(error.message)
        }
    }



    function uploadToS3(data, filename){
        const BUCKET_NAME = process.env.AWS_BUCKET_NAME
        const IAM_USER_KEY = process.env.AWS_IAM_USER_KEY
        const IAM_USER_SECRET = process.env.AWS_IAM_USER_SECRET


        let s3bucket = new AWS.S3({
            accessKeyId: IAM_USER_KEY,
            secretAccessKey: IAM_USER_SECRET
        })

        var params = {
            Bucket: BUCKET_NAME,
            Key: filename,
            Body: data,
            ACL: 'public-read',
            ContentDisposition: 'attachment; filename="myexpense.txt"'
        }
        console.log("Uploading file:", filename)
        return new Promise((resolve,reject)=>{
            s3bucket.upload(params, (err,s3response)=>{
                if(err){
                    console.log("S3 ERROR FULL:", JSON.stringify(err, null, 2))
                    console.log("Something went wrong")
                    // console.log(err)
                    reject(err)
                }else{
                    // console.log('success',s3response)
                    resolve(s3response.Location)
                }
            })

        })
    }

    const upload = async(req,res)=>{
        try {
            const file = req.file
            if(!file){
                return res.status(400).json("File not found")
            }

            const fileName = `${Date.now()}-${file.originalname}`

            const fileUrl = await uploadToS3(file.buffer, fileName)

            // console.log("File uploaded")

            res.status(200).json(fileUrl)

        } catch (error) {
            console.log(error)
        }
    }


    const getchatName = async(req,res)=>{
        try {
            const {phone} = req.query
            // console.log(phone)
            const chats = await Message.findAll({
                    attributes:['roomId'],
                    group: ['roomId']
            })

            const filteredChats = chats.filter(chat =>
                chat.roomId.includes(phone)
            )
            
            // console.log(chats)
            // chats.forEach(async (chat)=>{
            //     console.log(chat.roomId)
            //     let currChat = [chat.chatId]
            //     const result = chat.roomId.split("-").find(p => p !== phone)
            //     const name = await User.findOne({
            //         where:{phoneno:result}
            //     })
            //     currChat.append(name)
            //     chatName.append(currChat)
            // })

            const chatName = []
            for (const chat of filteredChats) {
                const otherPhone = chat.roomId.split("-").find(p => p !== phone)
            
                const user = await User.findOne({
                    where: { phoneno: otherPhone },
                    attributes: ['name', 'phoneno']
                })
            
                chatName.push({
                    roomId: chat.roomId,
                    name: user?.name || "Unknown",
                    phone: otherPhone
                })
            }

            // console.log(chatName)
            res.status(200).send(chatName)
        } catch (error) {
            res.status(500).json(error)
        }
    }

    module.exports = {addMessage, getMessages,initSocket, getName, upload, getchatName, status}