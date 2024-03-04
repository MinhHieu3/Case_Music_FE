let newBackground = document.getElementById("new-background");
let homeUser = document.getElementById("home")
let signup = document.getElementById("signup-background")
let forUser1 = document.getElementById("for-user1")
let loginNav = document.getElementById("login-nav")
let profileNav = document.getElementById("profile-nav")
let playlist = document.getElementById("playlist-nav-bar")
let adminBox = document.getElementById("admin-background")
let backUser = document.getElementById("back-user")
let playingBar = document.getElementById("playing-bar")
let functionBar = document.getElementById("function")
let currentPage = 1;
let totalPages = 0;
const itemsPerPage = 10;
let token = localStorage.getItem('userToken');
let role = localStorage.getItem('role');
let choicePlaylist1 = document.getElementById("choice-playlist1")
let choicePlaylist2 = document.getElementById("choice-playlist2")
let choicePlaylist3 = document.getElementById("choice-playlist3")
let playlistSelected = document.getElementById("playlist-selected")
let homeBtn = document.getElementById("home-btn")
let authorBackground = document.getElementById("author-background")
let itemDiv = ""
window.onload = function () {
    loginUser()
    let greetingElement = document.getElementById('good-something');
    let currentTime = new Date().getHours();

    if (currentTime < 12) {
        greetingElement.textContent = 'Good morning!';
    } else if (currentTime < 18) {
        greetingElement.textContent = 'Good afternoon!';
    } else {
        greetingElement.textContent = 'Good evening!';
    }

    console.log("load 1", currentId)

}
document.getElementById("myButton").addEventListener("click", function () {
    newBackground.style.display = "block";
    home.style.opacity = "75%";
});
document.getElementById("login-box").addEventListener("click", function () {
    newBackground.style.display = "block";
    signup.style.display = "none";
    home.style.opacity = "75%";
});
document.getElementById("signup-box").addEventListener("click", function () {
    signup.style.display = "block";
    newBackground.style.display = "none";
    home.style.opacity = "75%";
});
document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();
    let username = document.querySelector('[name="username"]').value;
    let password = document.querySelector('[name="password"]').value;
    let dataLogin = {
        "username": username,
        "password": password
    }
    axios.post(`http://localhost:8080/login`, dataLogin).then(res => {
        localStorage.setItem('userToken', res.data.accessToken);
        localStorage.setItem('role', res.data.roles[0].authority);
        localStorage.setItem('currentId', res.data.id);
        console.log(res.data)
        console.log(res.data.accessToken)
        console.log(res.data.roles[0].authority)
        loginUser()
        window.location.reload();
    })
        .catch(error => {
            console.error(error);
            if (error.response && error.response.status === 401) {
                alert("User account or password incorrect");
                document.getElementsByName('username')[0].value = '';
                document.getElementsByName('password')[0].value = '';
            }
        })
});

document.getElementById("signupForm").addEventListener('submit',function ( event ) {
    event.preventDefault();
    let dataSignup = {
        username : document.getElementById('usernameSignup').value,
        password : document.getElementById('passwordSignup').value,
        confirmPassword :document.getElementById('confirmPasswordSignup').value,
        name : document.getElementById('nameSignup').value,
        phone : document.getElementById('phoneSignup').value
    }
    let idRoles = document.getElementById('select-role');
    let selectedOption = idRoles.options[idRoles.selectedIndex];
    let id = selectedOption.value;
    console.log(id)
    console.log(dataSignup)
        axios.post(`http://localhost:8080/register/${id}`,dataSignup).then(()=>{
            document.getElementById('new-background').style.display='block'
            document.getElementById('signup-background').style.display='none'
            alert('Bạn đã đăng ký thành công tk')
        })
        .catch(error => {
            if (error.response.data === "Username existed")
            console.log(error)
           alert("Username existed")
            document.getElementById('usernameSignup').value = '';
            document.getElementById('passwordSignup').value = '';
            document.getElementById('confirmPasswordSignup').value = '';
            document.getElementById('nameSignup').value = '';
            document.getElementById('phoneSignup').value = '';
        });

})

function loginUser() {
    const nameItem = document.getElementById("name-item")
    const imgItem = document.getElementById("img-item")
    const playList = document.getElementById("playlist-list")
    currentId = localStorage.getItem("currentId")
    dataProfile(currentId)
    if (token !== null && role === 'ROLE_USER') {
        userView()
    } else if (token !== null && role === 'ROLE_ADMIN') {
        showListUser();
    } else if (token !== null && role === `ROLE_AUTHOR`) {
        showSongByAuthorId()
    }
}

function userView() {
    axios.get('http://localhost:8080/api/playLists/' + currentId, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(res => {
        console.log(currentId)
        const playlistList = document.getElementById("playlist-list");
        playlistList.innerHTML = '';
        res.data.forEach((item) => {
            itemDiv = document.createElement("div");
            itemDiv.setAttribute("data-id", item.id);
            const img = document.createElement("img");
            img.setAttribute("src", item.avatar);
            img.setAttribute("alt", "Playlist image");
            const name = document.createElement("p");
            name.classList.add("name-item");
            name.textContent = item.name;
            itemDiv.appendChild(img);
            itemDiv.appendChild(name);
            playlistList.appendChild(itemDiv);

            itemDiv.addEventListener('click', function () {
                const playlistId = this.getAttribute("data-id");
                itemDiv.id = `play-list${playlistId}`;
                axios.get(`http://localhost:8080/api/song-playlist/${playlistId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }).then(res => {
                    const songs = res.data.map(item => item.song);
                    localStorage.setItem('listSongs', JSON.stringify(songs))
                    choicePlaylist1.style.display = "none";
                    choicePlaylist2.style.display = "none";
                    choicePlaylist3.style.display = "none";
                    playlistSelected.style.display = "block"
                    let str = `<div id="playlist-selected-tiem">
<div class="top-top">
<div class="top">
<img src="${res.data[0].playList.avatar}" alt="">
<h2>${res.data[0].playList.name}</h2>
</div>
<div class="play-playlist-btn" >
<i class="fa-regular fa-circle-play pause" id="displayPlay" onclick="playList()"></i>
<i class="fa-regular fa-circle-pause pause" style="display: none" id="pauseMusic"></i>
</div>
</div>
<hr>
<div class="bot">
<table id="playlist-selected-table">
<tr>
<th>Song name</th>
<th>Album</th>
<th>Likes</th>
<th>Listens</th>
</tr>
`

                    res.data.forEach((item, index) => {
                        console.log("test", item.song)
                        str += `
<tr>
<td class="play-song" data-index="${index}">${item.song.name}</td>
<td>${item.song.album.name}</td>
<td>${item.song.likes}</td>
<td>${item.song.listens}</td>
</tr>
`
                    })
                    str += `</table></div></div>`
                    playlistSelected.innerHTML = str
                    document.querySelectorAll('.play-song').forEach(item => {
                        item.addEventListener('click', function () {
                            const index = parseInt(this.getAttribute('data-index'), 10);
                            localStorage.setItem('activeSongList', 'saveListSongs');
                            playSong(index);
                        });
                    });
                })
            });
        });
        newBackground.style.display = "none";
        homeUser.style.display = "block";
        forUser1.style.display = "flex"
        home.style.opacity = "100%";
        loginNav.style.display = "none";
        profileNav.style.display = "flex";
        playlist.style.display = "flex"
    })
}

document.getElementById("xLogin-btn").addEventListener("click", function () {
    newBackground.style.display = "none";
    home.style.opacity = "100%";
});
document.getElementById("xSignup-btn").addEventListener("click", function () {
    signup.style.display = "none";
    home.style.opacity = "100%";
});

document.getElementById("main-view").addEventListener("click", function () {
    newBackground.style.display = "none";
    document.getElementById("formEdit").style.display = "none";
    signup.style.display = "none";
    home.style.opacity = "100%";
});
document.getElementById("home-btn").addEventListener("click", function () {
    if (token !== null && role === 'ROLE_ADMIN') {
        window.location.reload()
    } else if (token !== null && role === 'ROLE_AUTHOR') {
        showSongByAuthorId()
    } else if (token !== null && role === 'ROLE_USER') {
        choicePlaylist1.style.display = "block";
        choicePlaylist2.style.display = "block";
        choicePlaylist3.style.display = "block";
        playlistSelected.style.display = "none"
    } else {
        window.location.reload()
    }
});
document.getElementById("logout").addEventListener("click", function () {
    localStorage.clear();
    window.location.reload();
})

function showListUser() {
    createPlaylist()
    adminBox.style.display = "block";
    forUser.style.display = "none"
    forUser1.style.display = "none"
    newBackground.style.display = "none";
    home.style.opacity = "100%";
    loginNav.style.display = "none";
    profileNav.style.display = "flex";
    playlist.style.display = "none"
    backUser.style.display = "none"
    playingBar.style.background = "#121212"
    functionBar.style.display = "none"
    document.getElementById(`home-page-title`).innerHTML = `Admin`
    document.getElementById(`search`).style.display = `none`
    axios.get(`http://localhost:8080/admin`).then(response => {
        let data = response.data;
        totalPages = Math.ceil(data.length / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, data.length);

        let str = `<table id="user-table-1">
                        <tr>
                            <th>Avatar</th>
                            <th>Username</th>
                            <th>Name</th>
                            <th>Enabled</th>
                            <th>Phone</th>
                            <th>Role</th>
                            <th></th>
                        </tr>`;

        for (let i = startIndex; i < endIndex; i++) {
            let user = data[i];
            let enabledStatus = user.enabled ? `Active` : `Inactive`;
            let roleStatus = user.roles[0].name === "ROLE_USER" ? `User` : `Author`;
            str += `<tr>
                        <td id="avt-${user.id}"><img src="${user.avt}" alt="User Avatar"></td>
                        <td id="username-${user.id}">${user.username}</td>
                        <td id="name-${user.id}">${user.name}</td>
                        <td id="enabled-${user.id}">${enabledStatus}</td>
                        <td id="phone-${user.id}">${user.phone}</td>
                        <td id="roles-${user.id}">${roleStatus}</td>
                        <td><button onclick="changeEnabled(${user.id})" class="btn btn-success">Change</button></td>
                    </tr>`;
        }
        str += `</table>`;
        if (totalPages > 1) {
            str += `<div class="user-table-btn">
                    <button onclick="previousPage()">Previous</button>
                    <button onclick="nextPage()">Next</button>
                    </div>`;
        }

        document.getElementById(`user-table`).innerHTML = str;
    }).catch(error => {
        console.error('Error fetching user data:', error);
    });
}

function changeEnabled(id) {
    let data = {
        avt: document.getElementById(`avt-${id}`).getAttribute('src'),
        username: document.getElementById(`username-${id}`).value,
        name: document.getElementById(`name-${id}`).value,
        enabled: document.getElementById(`enabled-${id}`).value,
        phone: document.getElementById(`phone-${id}`).value,
        roles: document.getElementById(`roles-${id}`).value,
    };
    axios.put(`http://localhost:8080/admin/${id}`, data).then(() => {
        showListUser();
    })
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        showListUser();
    }
}

function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        showListUser();
    }
}
