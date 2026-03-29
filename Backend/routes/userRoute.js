const express = require("express")
const router = express.Router()
const signupController = require("../controller/signupController")
const loginController = require("../controller/loginController")

router.post("/signup",signupController.addUser)
router.post("/validate",loginController.validate)
// router.post("/forgotPassword",loginController.forgotPassword)

module.exports = router