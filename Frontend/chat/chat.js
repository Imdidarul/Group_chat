const api_url = "http://localhost:3000/message"

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
        messageContent.value = ""
    })
    .catch((err)=>{
        console.log(err.message)
        message.textContent = err.response?.data || "Something went wrong"
        message.classList.add("error")
        // alert(err.response?.data || "something went wrong")
    })

}