// const socket = new WebSocket("ws://localhost:3000")

// const { event } = require("@getbrevo/brevo/dist/cjs/api")

// const {io} = require("socket.io-client")
const socket = io("http://localhost:3000",{
    auth: {
        token: localStorage.getItem("token")
    }
})
const api_url = "http://localhost:3000/message"

document.getElementById("message").addEventListener("keydown", function(e){
    if (e.key == "Enter"){
        handleMessageSubmit(e)
    }
})


document.getElementById("roomName").addEventListener("keydown", function(e){
    if (e.key=="Enter"){
        e.preventDefault()
        const currPhone = localStorage.getItem("phone")
        const roomName = [currPhone,e.target.value].sort().join("-")

        // console.log(roomName)

        localStorage.setItem("roomName", roomName)

        socket.emit("join-room", roomName)
        alert("Room id"+roomName)
        // console.log(currPhone)
        loadMessages(e.target.value)
        const btn = document.getElementById("exitRoom")
        btn.disabled = false
    }
})

document.getElementById("exitRoom").addEventListener("click", function(e){
    e.preventDefault()
    const btn = document.getElementById("exitRoom")
    const roomName = localStorage.getItem("roomName")
    if (roomName) {
        socket.emit("leave-room", roomName);
    }
    localStorage.removeItem("roomName")


    alert("Room exited")
    btn.disabled = true
    loadMessages("None")
})



function openUploadPopup() {
    document.getElementById("uploadPopup").style.display = "flex";
}
  
function closeUploadPopup() {
document.getElementById("uploadPopup").style.display = "none";
}


document.getElementById("uploadForm").addEventListener("submit", async (e)=>{
    e.preventDefault()

    const fileInput = document.getElementById("fileInput")
    const file = fileInput.files[0]

    const formData = new FormData()
    formData.append("file", file)

    try {
        const res = await axios.post("http://localhost:3000/message/upload",formData)

        const fileUrl = res.data

        let type = "file"
        if(file.type.startsWith("image/")) type = "image"
        else if (file.type.startsWith("video/")) type = "video"
        else if (file.type.startsWith("audio/")) type = "audio"

        socket.emit("sendMessage",{
            messageContent: fileUrl,
            type: type
        })
        fileInput.value = ""
        closeUploadPopup()

    }catch(error){
        console.log("Couldn't be uploaded",error)
    }
})


function renderContent(msg){
    if (msg.type === "image"){
        return `<img src="${msg.messageContent}" width="150" />`
    } 
    else if (msg.type === "video") {
        return `<video src="${msg.messageContent}" controls width="200"></video>`
    } 
    else if (msg.type === "audio") {
        return `<audio src="${msg.messageContent}" controls></audio>`
    } 
    else {
        return `<p>${msg.messageContent}</p>`
    }
}



socket.on("connect",()=>{
    console.log("Connected:",socket.id)

    const roomName = localStorage.getItem("roomName")
    if (roomName){
        socket.emit("join-room", roomName)
    }
})

socket.on("Message", (msg) => {
    // console.log(socket.id);
    const currRoom = localStorage.getItem("roomName") || "broadcast"

    if(msg.roomId !== currRoom) return

    const chatBox = document.querySelector(".chat-box")
    const div = document.createElement("div")

    const currentUserId = localStorage.getItem("userId")
    div.classList.add("msg");

    if (msg.userId == currentUserId){
        div.classList.add("right");    
        div.innerHTML = `
        ${renderContent(msg)}
        <span>${new Date(msg.createdAt).toLocaleTimeString()}</span>
        `;
    }else{
        div.classList.add("left")
        div.innerHTML = `
        <p style="font-weight: bold">${msg.userName}</p>
        ${renderContent(msg)}
        <span>${new Date(msg.createdAt).toLocaleTimeString()}</span>
        `;
    }

    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight

  });

function handleMessageSubmit(event){
    event.preventDefault()
    messageValue = document.getElementById("message").value

    const messageContent = {
        messageContent: messageValue
    }


    socket.emit("sendMessage",messageContent)
    document.getElementById("message").value = ""

}


async function loadMessages(phone) {
    try {
        let roomName = localStorage.getItem("roomName")
        if (!roomName){
           roomName = "broadcast" 
           document.querySelector(".chat-header h3").textContent = "Global Chat";
           document.querySelector(".chat-item.active h4").textContent = "Global"
        }else{
            let userPhone = phone
            // console.log("User phone is:",userPhone)
            const resName = await axios.get(`http://localhost:3000/message/getName?userPhone=${userPhone}`)
            document.querySelector(".chat-header h3").textContent = resName.data.name
            document.querySelector(".chat-item.active h4").textContent = resName.data.name
        }
        // alert("Roomname is broadcast")
        const res = await axios.get(`http://localhost:3000/message/getMessages?roomId=${roomName}`);


        // console.log(res.data.messages)
        const chatBox = document.querySelector(".chat-box");
        chatBox.innerHTML = "";
        const currentUserId = localStorage.getItem("userId")
        // console.log(currentUserId)

        res.data.messages.forEach(msg => {
            // alert(msg.User.name)
            const div = document.createElement("div");

            div.classList.add("msg");
            if (msg.userId == currentUserId){
                // console.log(currentUserId)
                div.classList.add("right");
                div.innerHTML = `
                ${renderContent(msg)}
                <span>${new Date(msg.createdAt).toLocaleTimeString()}</span>
            `;
            }else{
                div.classList.add("left")
                div.innerHTML = `
                <p style="font-weight: bold">${msg.user?.name || "Unknown"}</p>
                ${renderContent(msg)}
                <span>${new Date(msg.createdAt).toLocaleTimeString()}</span>
            `;
            }


            chatBox.appendChild(div);
            chatBox.scrollTop = chatBox.scrollHeight
            
        });

    } catch (err) {
        console.log(err);
    }
}


window.addEventListener("DOMContentLoaded",()=>{
    loadMessages()
})