const express = require("express")
const router = express.Router()
const signupController = require("../controller/signupController")
const loginController = require("../controller/loginController")
const auth = require("../middleware/auth")

router.post("/signup",signupController.addUser)
router.post("/validate",loginController.validate)
router.get("/permit",auth, loginController.permit)
// router.post("/forgotPassword",loginController.forgotPassword)

module.exports = router