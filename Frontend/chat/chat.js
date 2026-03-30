const api_url = "http://localhost:3000/user"

function handleMessageSubmit(event){
    event.preventDefault()
    userId = localStorage.getItem(userId)
    messageContent = document.getElementById("message").value

    const messageContent = {
        userId: userId,
        messageContent: messageContent
    }


}