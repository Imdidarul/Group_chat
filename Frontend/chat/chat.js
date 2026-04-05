
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
    chatName()
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

function checkUser(){
    const token = localStorage.getItem("token")
    axios.get("http://localhost:3000/user/permit", {
    headers: {
        Authorization: `Bearer ${token}`
    }
})
.then(()=>{
    console.log("User verified")
})
.catch((error)=>{
    console.log(error)

    alert("User not found")

    localStorage.clear()
    window.location.href = "../login.html"
})
}

async function chatName(){
    const phone = localStorage.getItem("phone")
    const res = await axios.get(`http://localhost:3000/message/chatName?phone=${phone}`)
    const currentRoom = localStorage.getItem("roomName") || "broadcast"
    
    const chats = res.data

    const chatList = document.querySelector(".chat-list")

    chatList.innerHTML = ""

    const globalDiv = document.createElement("div")
    // globalDiv.classList.add("chat-item", "active")
    globalDiv.classList.add("chat-item")
    globalDiv.setAttribute("room-id", "broadcast")

    if (currentRoom === "broadcast") {
        globalDiv.classList.add("active")
    }

    globalDiv.innerHTML = `
        <div class="avatar"></div>
        <div>
            <h4>Global</h4>
        </div>
    `
    chatList.appendChild(globalDiv)

    globalDiv.addEventListener("click", () => {
        document.querySelectorAll(".chat-item").forEach(ch=>ch.classList.remove("active"))
        const btn = document.getElementById("exitRoom")
    
        globalDiv.classList.add("active")
        const roomName = localStorage.getItem("roomName")
        socket.emit("leave-room",roomName)
        localStorage.removeItem("roomName")
        btn.disabled = true
        chatName()
        loadMessages("None")
    })

    chats.forEach(chat=>{
        if(chat.roomId === "broadcast") return

        const div = document.createElement("div")
        div.classList.add("chat-item")
        if (chat.roomId === currentRoom) {
            div.classList.add("active")
        }

        div.setAttribute("room-id", chat.roomId)

        div.innerHTML = `
            <div class="avatar"></div>
            <div>
                <h4>${chat.name}</h4>
            </div>
        `
        
        div.addEventListener("click",()=>{
            document.querySelectorAll(".chat-item").forEach(ch => ch.classList.remove("active"))
            const btn = document.getElementById("exitRoom")

            div.classList.add("active")

            const roomId = div.getAttribute("room-id")
            const prevRoom = localStorage.getItem("roomName")
            if (prevRoom){
                socket.emit("leave-room", prevRoom)
            }

            localStorage.setItem("roomName", roomId)

            socket.emit("join-room", roomId)

            const otherPhone = roomId.split("-").find(p=>p!==phone)
            btn.disabled = false
            loadMessages(otherPhone)
            chatName()
        })

        chatList.appendChild(div)
    })
    
}




window.addEventListener("DOMContentLoaded",()=>{
    checkUser()
    loadMessages()
    chatName()
})