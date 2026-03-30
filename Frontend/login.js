const api_url = "http://localhost:3000/user"

function handleFormSubmit(event){
    event.preventDefault()

    // const loginDetails = {
    //     email: document.getElementById("email").value,
    //     password: document.getElementById("password").value
    // }

    const loginDetails = {
        identifier: document.getElementById("identifier").value,
        password: document.getElementById("password").value
    }


    axios.post(`${api_url}/validate`,loginDetails).then((result)=>{
        alert("Logged in successfully")
        // localStorage.setItem('token', result.data.token)
        localStorage.setItem("userId",result.data.id)
        // localStorage.setItem('premium', result.data.premium)
        console.log(result.data.token)
        window.location.href = "./index.html"

    }).catch((error)=>{
        if(error.response){
            alert(error.response.data.message)
        }else{
            alert("Server side error")
        }
    })
}