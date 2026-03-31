const socket = new WebSocket("ws://localhost:3000")
const api_url = "http://localhost:3000/message"

socket.onmessage = function(event){
    const msg = JSON.parse(event.data)
    
    const chatBox = document.querySelector(".chat-box")
    const div = document.createElement("div")

    const currentUserId = localStorage.getItem("userId")

    div.classList.add("msg");
        if (msg.userId === currentUserId){
            div.classList.add("right");    
        }else{div.classList.add("left")}

    div.innerHTML = `
        <p>${msg.userId}</p>
        <p>${msg.messageContent}</p>
        <span>${new Date(msg.createdAt).toLocaleTimeString()}</span>
        `;

    chatBox.appendChild(div);
    
}

function handleMessageSubmit(event){
    event.preventDefault()
    userId = localStorage.getItem("userId")
    // console.log(userId)
    // alert(userId)
    messageContent = document.getElementById("message").value

    const messageDetails = {
        userId: userId,
        messageContent: messageContent
    }

    axios.post(`${api_url}/addMessage`,messageDetails)
    .then((res)=>{
        // console.log("Message saved.")
        // event.target.reset()
        document.getElementById("message").value = ""
    })
    .catch((err)=>{
        console.log(err.message)
        message.textContent = err.response?.data || "Something went wrong"
        message.classList.add("error")
        // alert(err.response?.data || "something went wrong")
    })

}


async function loadMessages() {
    try {
        const res = await axios.get("http://localhost:3000/message/getMessages");

        const chatBox = document.querySelector(".chat-box");
        chatBox.innerHTML = "";
        const currentUserId = localStorage.getItem("userId")

        res.data.messages.forEach(msg => {
            const div = document.createElement("div");

            div.classList.add("msg");
            if (msg.userId === currentUserId){
                div.classList.add("right");    
            }else{div.classList.add("left")}

            div.innerHTML = `
                <p>${msg.userId}</p>
                <p>${msg.messageContent}</p>
                <span>${new Date(msg.createdAt).toLocaleTimeString()}</span>
            `;

            chatBox.appendChild(div);
        });

    } catch (err) {
        console.log(err);
    }
}


window.addEventListener("DOMContentLoaded",()=>{
    loadMessages()
})