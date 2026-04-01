// const socket = new WebSocket("ws://localhost:3000")
// const {io} = require("socket.io-client")
const socket = io("http://localhost:3000",{
    auth: {
        token: localStorage.getItem("token")
    }
})
const api_url = "http://localhost:3000/message"


socket.on("connect",()=>{
    console.log("Connected:",socket.id)
})

socket.on("Message", (msg) => {
    console.log(socket.id);

    const chatBox = document.querySelector(".chat-box")
    const div = document.createElement("div")

    const currentUserId = localStorage.getItem("userId")

    div.classList.add("msg");
        if (msg.userId == currentUserId){
            div.classList.add("right");    
            div.innerHTML = `
            <p>${msg.messageContent}</p>
            <span>${new Date(msg.createdAt).toLocaleTimeString()}</span>
            `;
        }else{
            div.classList.add("left")
            div.innerHTML = `
            <p style="font-weight: bold">${msg.userName}</p>
            <p>${msg.messageContent}</p>
            <span>${new Date(msg.createdAt).toLocaleTimeString()}</span>
            `;
    }

    chatBox.appendChild(div);

  });

// socket.onmessage = function(event){
//     const msg = JSON.parse(event.data)
    
    // const chatBox = document.querySelector(".chat-box")
    // const div = document.createElement("div")

    // const currentUserId = localStorage.getItem("userId")

    // div.classList.add("msg");
    //     if (msg.userId === currentUserId){
    //         div.classList.add("right");    
    //         div.innerHTML = `
    //         <p>${msg.messageContent}</p>
    //         <span>${new Date(msg.createdAt).toLocaleTimeString()}</span>
    //         `;
    //     }else{
    //         div.classList.add("left")
    //         div.innerHTML = `
    //         <p style="font-weight: bold">${msg.userName}</p>
    //         <p>${msg.messageContent}</p>
    //         <span>${new Date(msg.createdAt).toLocaleTimeString()}</span>
    //         `;
    // }

    // chatBox.appendChild(div);
    
// }

function handleMessageSubmit(event){
    event.preventDefault()
    userId = localStorage.getItem("userId")
    // console.log(userId)
    // alert(userId)
    messageValue = document.getElementById("message").value

    const messageContent = {
        messageContent: messageValue
    }


    socket.emit("sendMessage",messageContent)
    document.getElementById("message").value = ""
    // axios.post(`${api_url}/addMessage`,messageDetails)
    // .then((res)=>{
    //     // console.log("Message saved.")
    //     // event.target.reset()
    //     document.getElementById("message").value = ""
    // })
    // .catch((err)=>{
    //     console.log(err.message)
    //     // message.textContent = err.response?.data || "Something went wrong"
    //     message.classList.add("error")
    //     // alert(err.response?.data || "something went wrong")
    // })

}


async function loadMessages() {
    try {
        const res = await axios.get("http://localhost:3000/message/getMessages");

        console.log(res.data.messages)
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
                <p>${msg.messageContent}</p>
                <span>${new Date(msg.createdAt).toLocaleTimeString()}</span>
            `;
            }else{
                div.classList.add("left")
                div.innerHTML = `
                <p style="font-weight: bold">${msg.user?.name || "Unknown"}</p>
                <p>${msg.messageContent}</p>
                <span>${new Date(msg.createdAt).toLocaleTimeString()}</span>
            `;
            }


            chatBox.appendChild(div);
        });

    } catch (err) {
        console.log(err);
    }
}


window.addEventListener("DOMContentLoaded",()=>{
    loadMessages()
})