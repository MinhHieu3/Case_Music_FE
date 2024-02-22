var newBackground = document.getElementById("new-background");
var homeUser = document.getElementById("home")
document.getElementById("myButton").addEventListener("click", function() {
    newBackground.style.display="block";
    homeUser.style.display="none";
});
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var username = document.querySelector('[name="username"]').value;
    var password = document.querySelector('[name="password"]').value;
    data={
        "username": username,
        "password": password
    }
    axios.post(`http://localhost:8080/login`,data).then(res=>{
        console.log(res)
        newBackground.style.display = "none";
        homeUser.style.display = "block";
    })
        .catch(error => {
            console.error(error);
            if (error.response && error.response.status === 401) {
                alert("Tài Khoản Hoặc Mật Khẩu Sai");
            }
    })
});