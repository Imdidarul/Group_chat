const express = require("express")
const app = express()
require('dotenv').config()
const db = require("./utils/dbConnection")
const cors = require("cors")
// const helemt = require("helmet")
// const morgan = require("morgan")
const fs = require("fs")
const path = require("path")
const userRoute = require("./routes/userRoute")
const messageRoute = require("./routes/messageRoute")


// const logStream = fs.createWriteStream(
//     path.join(__dirname,'tmp/access.log'),
//     {flags: 'a'}
// );



app.use(cors())
app.use(express.json())
// app.use(helemt())
// app.use(morgan('combined', {stream: logStream}))

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
    app.listen(process.env.PORT || 3000,(err)=>{
        console.log("Server is running")
    })
}).catch((err)=>{
    console.log("Unable to connect to server")
})