// const {User} = require("../model")
const User = require("../model/user")
const bcrypt = require("bcrypt")

const addUser = async (req,res)=>{
    try {
        const {name, email, phoneno, password} = req.body
        const saltrounds = 10

        bcrypt.hash(password, saltrounds, async function(err,hash){
            await User.create({
                name: name,
                email:email,
                password:hash,
                phoneno: phoneno
                // premium: false
            })
        })

        console.log("User is created")
        res.status(201).send(`User ${name} is created!`)
    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(409).send("Email already exists");
        }
        res.status(500).send("Unable to add user!")
    }
}


module.exports = {addUser}