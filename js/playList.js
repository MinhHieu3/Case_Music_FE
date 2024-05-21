let background_create_playlist = document.getElementById('background-create-playlist')
let url = `http://localhost:8080/api/songs`;
let idPlaylist;
let idAlbum;
let background_author=document.getElementById("author-background");
let background_create_album=document.getElementById("background-create-album");

function createPlaylist() {
    background_user.style.display = 'none';
    background_create_playlist.style.display = 'block';
    dataSong(url)
}
function createAlbums() {
    background_author.style.display="none";
    background_create_album.style.display="block";
    dataSongAlbum(url)
}

function searchSong() {
    let search = document.getElementById('searchSong').value;
    if (search !== null) {
        dataSong(`http://localhost:8080/api/songs?name=${search}`)
    }
}

function dataSong(url) {
    axios.get(url).then(res => {
        let str = ` <table class="all-song-tb">
                            <tr class="all-song-thead">
                                <th></th>
                            <th>Name Song</th>
                            <th>Name Singer</th>
                            <th>Album</th>
                            <th>Category</th>
                            <th></th>
                            </tr>`;
        res.data.forEach((item, index) => {
            str += `<tr class="all-song-tbody">
                                <td><img src="${item.album.avatar}" style="width: 50px;height: 50px;margin-top: 10px;margin-left: 30px"></td>
                                <td>${item.name}</td>
                                <td>${item.singer.name}</td>
                                <td>${item.album.name}</td>
                                <td>${item.category.name}</td>
                                <td><button onclick="addSongPlaylist(${item.id})" >Add</button></td>
                            </tr>`
        })
        str += `</table>`;
        document.getElementById(`show`).innerHTML = str;
    })
}


function changePlaylist() {
    document.getElementById('fileInput').click();
}

function savePalaylist() {
    let name = document.getElementById('create_playlist').value;
    currentId = localStorage.getItem("currentId")
    console.log(name)
    let img = '';
    if (imageURL == null) {
        img = '../img/3427956.jpg';
    } else {
        img = imageURL;
    }
    let data = {
        name: name,
        avatar: img,
        user: {
            id: currentId
        }
    }
    axios.post('http://localhost:8080/api/playLists',data).then(res=>{
        userView()
        idPlaylist=res.data.id
    })
}
function addSongPlaylist(id) {
    let data={
        playList:{
            id:idPlaylist
        },
        song:{
            id:id
        }
    }
    axios.post("http://localhost:8080/api/song-playlist",data).then(()=>{
        alert("Bài Hát Đã Được Thêm")
    })
}


function searchSongInAlbum() {
    let search = document.getElementById('searchSongs').value;
    if (search !== null) {
        dataSongAlbum(`http://localhost:8080/api/songs?name=${search}`)
    }
}
function dataSongAlbum(url) {
    axios.get(url).then(res => {
        let str = ` <table class="all-song-tb">
                            <tr class="all-song-thead">
                                <th></th>
                            <th>Name Song</th>
                            <th>Name Singer</th>
                            <th>Album</th>
                            <th>Category</th>
                            <th></th>
                            </tr>`;
        res.data.forEach((item, index) => {
            str += `<tr class="all-song-tbody">
                                <td><img src="${item.album.avatar}" style="width: 50px;height: 50px;margin-top: 10px;margin-left: 30px"></td>
                                <td>${item.name}</td>
                                <td>${item.singer.name}</td>
                                <td>${item.album.name}</td>
                                <td>${item.category.name}</td>
                                <td><button onclick="addSongPlaylist(${item.id})" >Add</button></td>
                            </tr>`
        })
        str += `</table>`;
        document.getElementById(`shows`).innerHTML = str;
    })
}

function changeAlbum() {
    document.getElementById('fileInputAlbum').click();
}
function saveAlbum() {
    let name = document.getElementById('create_album').value;
    let img = '';
    if (imageURL == null) {
        img = "https://firebasestorage.googleapis.com/v0/b/test-91e51.appspot.com/o/music%2F4799iXrUwxXqto.jpg?alt=media&token=5d7fd1df-bb09-4dc4-bb03-0ff8a20e5cf4";
    } else {
        img = imageURL;
    }
    let data = {
        name: name,
        avatar: img,
        likes:0,
        listens:0,
        user:
            {
                id:currentId
            }
    }
    axios.post('http://localhost:8080/api/albums',data).then(res=>{
        console.log(res)
        alert("Tạo Album Thành Công")
        Album()
        idAlbum=res.data.id
    })
}