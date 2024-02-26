
function showListUser(){
    axios.get(`http://localhost:8080/admin`).then(user => {
        let data = user.data;
        let str =   `<table border="1px solid black">
            <tr>
                <th>Avatar</th>
                <th>Username</th>
                <th>Name</th>
                <th>Enabled</th>
                <th>Phone</th>
                <th>Role</th>
            </tr>`
        for (const user of data) {
            str += `<tr>
                        <td>${user.avt}</td>
                        <td>${user.username}</td>
                        <td>${user.name}</td>
                        <td>${user.enabled}</td>
                        <td>${user.phone}</td>
                        <td>${user.roles[0].name}</td>
                    </tr>`
        }
        str += `</table>`
        document.getElementById("list-user").innerHTML = str
        var userBackground = document.getElementById("user-background");
        var listUser = document.getElementById("list-user");

        // Ẩn đi phần tử user-background và hiển thị phần tử list-user
        userBackground.style.display = "none";
        listUser.style.display = "block";
    })
}

