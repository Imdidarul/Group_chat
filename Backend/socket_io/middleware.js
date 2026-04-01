const {User} = require("../model")
const jwt = require("jsonwebtoken")

module.exports = (io) => {
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
}