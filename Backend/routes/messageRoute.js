const express = require("express")
const router = express.Router()
const messageController = require("../controller/messageController")

router.post("/addMessage",messageController.addMessage)
router.get("/getMessages",messageController.getMessages)

module.exports = router