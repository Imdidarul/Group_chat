const api_url = "http://localhost:3000/user"




function handleFormSubmit(event){
    event.preventDefault()

    // const message = document.getElementById("message")
    // message.textContent = ""
    // message.className = "message"

    const userDetails = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phoneno: document.getElementById("phno").value,
        password: document.getElementById("password").value
    }

    axios.post(`${api_url}/signup`,userDetails)
    .then((res)=>{
        // message.textContent = "User registered successfully"
        // message.classList.add("success")
        alert("User is added successfully")
        event.target.reset()
    })
    .catch((err)=>{
        console.log(err.message)
        message.textContent = err.response?.data || "Something went wrong"
        message.classList.add("error")
        // alert(err.response?.data || "something went wrong")
    })
}


