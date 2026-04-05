const {Message} = require("../model")
const axios = require("axios")
const prevMessage = async(req,res)=>{
    let {roomId} = req.query
        if (roomId == "null"){
            roomId = "broadcast"
        }
        console.log("The roomid is:-",roomId)

        const lastMessage = await Message.findOne({
            where:{roomId:roomId},
            order:[["createdAt","DESC"]]
        })
        // console.log(lastMessage.toJSON())
        // console.log("The last message is:-",lastMessage?.toJSON())
        const messageContent = lastMessage.messageContent
        if (!messageContent) return res.status(404).json("No message found")
        const msg_userId = lastMessage.userId
        res.status(200).json({messageContent:messageContent, msg_userId:msg_userId})

}

const smartReply = async (req, res) => {
    try {
        // const { description } = req.body
        // const {phone} = req.query
        // const myPhone = phone[0]
        // const otherPhone = phone[1]
        // const roomId = [myPhone,otherPhone].sort().join("-")
        // const {roomId} = req.query
        const {messageContent} = req.query

        const response = await axios.post(
            "https://router.huggingface.co/v1/chat/completions",
            {
                model: "meta-llama/Meta-Llama-3-8B-Instruct", 
                messages: [
                    {
                        role: "user",
                        content: `Give a natural, human-like reply to the following message. The reply should sound genuine, casual, short and emotionally appropriate—like something a real person would actually say in conversation. Avoid sounding robotic, overly formal, or generic. Keep it concise and context-aware, and don’t include explanations or multiple options—just one realistic reply.Do not use quotations around the message. Also do not give context like just got back from a meeting etc. 

Item: ${messageContent}
Category:`
                    }
                ],
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        )
        // console.log(response.data.choices[0].message.content)

        res.status(200).json(response.data.choices[0].message.content)

    } catch (error) {
        console.log(error.response?.data || error.message)
        res.status(500).json({ error: "AI suggestion failed" })
    }
}

const suggestion = async(req,res)=>{
    try{
    const {msg} = req.query
    // console.log("THIS IS THE MSG:-", msg)

    const response = await axios.post(
        "https://router.huggingface.co/v1/chat/completions",
        {
            model: "meta-llama/Meta-Llama-3-8B-Instruct", 
            messages: [
                {
                    role: "user",
                    content: `Complete the sentence by continuing the given input. You MUST start your response with the exact input text provided and then naturally continue it into a longer, human-like sentence. Do not rephrase, replace, or omit any part of the input. Keep the response simple, conversational, and without unnecessary context or backstory.

                    Example:
                    Input: "hello"
                    Output: "hello, how are you?"

Item: ${msg}`
                }
            ],
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                "Content-Type": "application/json"
            }
        }
    )
    // console.log(response.data.choices[0].message.content)

    res.status(200).json(response.data.choices[0].message.content)
    }catch(error){
        console.log(error.response?.data || error.message)
        res.status(500).json({ error: "AI suggestion failed" })
    }

}

module.exports = {prevMessage, smartReply, suggestion }
