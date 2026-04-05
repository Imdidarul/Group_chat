// const {User, ForgotPasswordRequests} = require("../model/user")
const {User} = require("../model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const {v4:uuidv4} = require("uuid")
const {BrevoClient} = require('@getbrevo/brevo')

function generateToken(id){
    return jwt.sign({userId: id}, process.env.AUTH_SECRET_KEY)
}

const validate = async (req,res)=>{
    try {
        const {identifier,password} = req.body

        let user
        // const user = await User.findOne({where:{email:email}})
        if (identifier.includes("@")){
            user = await User.findOne({where:{email:identifier}})
        }else{
            user = await User.findOne({where:{phoneno: identifier}})
        }
        if(!user){
            return res.status(404).json({message:"Error:404 User not found"})
        
        }
        id = user.id

        bcrypt.compare(password, user.password, (err,result)=>{
            if (err){
                return res.status(400).json("Something went wrong")
            }
            if (result){
                return res.status(200).json({message:"User logged in succesfully", id: id, token: generateToken(user.id), phone: user.phoneno})
            }else{
                return res.status(401).json({message:"Password is incorrect"})
            }
        })
    // const isMatch = await bcrypt.compare(password, user.password, (err, result)=>{
    //     if (isMatch){
    //         return res.status(200).json({message:"User logged in succesfully", token: generateToken(user.id)})
    //     }else{
    //         return res.status(401).json({message:"Password is incorrect"})
    //     }
    // })

    // console.log("user logged in successfully")
    // res.status(200).send("User logged in successfully")
        
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }
}

const permit = async(req,res)=>{
    try {
        const userId = req.user.userId
        const user = await User.findByPk(userId)
        if(user){
            res.status(200).send("User found")
        }else{
            res.status(404).send("User not found")
        }
    } catch (error) {
        res.status(500).send(error.message)
    }
}


// const forgotPassword = async(req, res)=>{
//     try {

//         const brevo = new BrevoClient({
//         apiKey: process.env.BREVO_API_KEY,
//         });
//         const {email} = req.body

//         const user = await User.findOne({where:{email:email}})
//         if (!user){
//             return res.status(404).json("User not found")
//         }


//         await ForgotPasswordRequests.update(
//             {isactive:false},
//             {where:{userId:user.id}}
//             )

//         const uuid = uuidv4()

//         await ForgotPasswordRequests.create({
//             id:uuid,
//             userId: user.id,
//             isactive: true
//         })

//         console.log("BREVO KEY:", process.env.BREVO_API_KEY)

//         const link = `http://127.0.0.1:5500/FRONTEND/resetPassword.html?token=${uuid}`


//         const result = await brevo.transactionalEmails.sendTransacEmail({
//         subject: "Reset Password",
//         htmlContent: `<html>
//             <body>
//                 <h2>Password Reset Link:</h2>
//                 <a href="${link}">Click</a>
//             </body>
//         </html>`,
//         // textContent: ,
//         sender: { name: "Didar", email: "didarullaskar1@gmail.com" },
//         to: [{ email: email }]
//         });

//         console.log('Email sent:', result);
//         res.status(200).json("Email Sent")

//     } catch (error) {
//         console.log(error)
//         res.status(500).json(error.message)
//     }
// }


// const updatePassword = async(req,res)=>{
//     try {
//         const {token, newPassword} = req.body
//         const resetRequest = await ForgotPasswordRequests.findByPk(token)
//         if(!resetRequest){
//             return res.status(404).json("Reset request not found")
//         }
//         if(!resetRequest.isactive){
//             return res.status(403).json("Password reset not authorized")
//         }
//         const userId = resetRequest.userId
//         const saltrounds = 10

//         bcrypt.hash(newPassword, saltrounds, async function(err,hash){
//             await User.update({password:hash},{where:{id:userId}})
//         })

//         await ForgotPasswordRequests.update(
//             {isactive:false},
//             {where:{id:token}}
//         )
//         res.status(200).json("Password updated")
//     } catch (error) {
//         res.status(500).json(error)
//     }
// }


// module.exports = {validate,forgotPassword, updatePassword}
module.exports = {validate, permit}