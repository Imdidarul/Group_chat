const express = require("express")
const router = express.Router()
const messageController = require("../controller/messageController")
const multer = require("multer")
const upload = multer({ storage: multer.memoryStorage() })

router.post("/addMessage",messageController.addMessage)
router.get("/getMessages",messageController.getMessages)
router.get("/getName",messageController.getName)
router.post("/upload",upload.single("file"),messageController.upload)
module.exports = router