const express = require("express")
const app = express()
require('dotenv').config()
require("./model")
const db = require("./utils/dbConnection")
const cors = require("cors")
const http = require("http")
const userRoute = require("./routes/userRoute")
const messageRoute = require("./routes/messageRoute")
const server = http.createServer(app)
const socketIO = require("./socket_io")



app.use(cors())
app.use(express.json())


socketIO(server)




app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
  });
app.use("/user",userRoute)
app.use("/message",messageRoute)


app.use((err, req, res, next) => {
    console.error("GLOBAL ERROR:", err.message);
    console.error(err.stack);

    res.status(500).json({
        message: "Something went wrong",
        error: err.message
    });
});


db.sync({alter: true}).then(()=>{
    server.listen(process.env.PORT || 3000,(err)=>{
        console.log("Server is running")
    })
}).catch((err)=>{
    console.log("Unable to connect to server")
})