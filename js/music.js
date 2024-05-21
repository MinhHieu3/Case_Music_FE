const song = JSON.parse(localStorage.getItem('indexSong'))
const savedSongs = JSON.parse(localStorage.getItem('songs'))
const idSongs = JSON.parse(localStorage.getItem('idSong'))
Songs()
TopNew()
ShowAlbum()
function ShowList() {
    Songs('http://localhost:8080/api/songs')
}

function Songs() {
    axios.get('http://localhost:8080/api/songs/top').then(res => {
        const card = document.getElementById("card");
        card.innerHTML = '';
        res.data.forEach((item, index) => {
            const songDiv = document.createElement("div");
            songDiv.className = "App__section-grid-item";
            songDiv.innerHTML = `
            <div style="height: 136px ;margin-bottom: 10px" ><img src="${item.album.avatar}" alt=""></div>
            <div class="song-name" >${item.name}</div>
            <div><span>${item.singer.name}</span></div>
            <div><span>${item.category.name}</span></div>
        `;
            songDiv.querySelector('.song-name').addEventListener('click', function () {
                localStorage.setItem('activeSongList', 'savedSongs');
                localStorage.setItem('songs', JSON.stringify(res.data));
                localStorage.setItem('activeSongList', 'savedSongs');
                localStorage.setItem('idSong', JSON.stringify(`${item.id}`))
                 playSong(index)
            });
            card.appendChild(songDiv);

        });

    });
}
function TopNew(){
    axios.get(`http://localhost:8080/api/songs/top5-new-song`).then(res => {
        const card = document.getElementById("card-new");
        card.innerHTML = '';
        res.data.forEach((item, index) => {
            const songDiv = document.createElement("div");
            songDiv.className = "App__section-grid-item";
            songDiv.innerHTML = `
            <div style="height: 136px ;margin-bottom: 10px" ><img src="${item.album.avatar}" alt=""></div>
            <div class="song-name" >${item.name}</div>
            <div><span>${item.singer.name}</span></div>
            <div><span>${item.category.name}</span></div>
        `;
            songDiv.querySelector('.song-name').addEventListener('click', function () {
                localStorage.setItem('activeSongList', 'savedSongs');
                localStorage.setItem('songs', JSON.stringify(res.data));
                localStorage.setItem('activeSongList', 'savedSongs');
                localStorage.setItem('idSong', JSON.stringify(`${item.id}`))
                playSong(index)
            });
            card.appendChild(songDiv);

        });

    });
}

function ShowAlbum(){
    axios.get(`http://localhost:8080/api/albums/top-by-listens`).then(res => {
        console.log(res.data);
        const card = document.getElementById("card-album");
        card.innerHTML = '';
        res.data.forEach((item, index) => {
            const songDiv = document.createElement("div");
            songDiv.className = "App__section-grid-item";
            songDiv.innerHTML = `
                <div style="height: 136px ;width: 176px;margin-bottom: 20px"><img src="${item.avatar}" alt=""></div>
                <div class="song-name">${item.name}</div>
                <div><span>${item.listens}</span></div>
            `;
            card.appendChild(songDiv);
        });
    }).catch(error => {
        console.error("There was an error fetching the album data:", error);
    });
}


function playSong(indexSong) {
    function getCurrentSongList() {
        const activeSongList = localStorage.getItem('activeSongList');
        if (activeSongList === 'saveListSongs') {
            return JSON.parse(localStorage.getItem('listSongs'));
        } else if (activeSongList === 'savedSongs') {
            return JSON.parse(localStorage.getItem('songs'));
        }
    }
    const currentSongs = getCurrentSongList();
    if (indexSong < 0 || indexSong >= currentSongs.length) return;
    const song = currentSongs[indexSong];
    localStorage.setItem('indexSong', JSON.stringify(currentSongs[indexSong]));
    toggleAudio(song.src, song.name, song.singer.name, song.album.avatar)
    updateLike(song.likes)
    if (localStorage.getItem('activeSongList') === 'saveListSongs') {
        const audioPlayer = document.getElementById('myAudio');
        audioPlayer.onended = () => {
            if (indexSong < currentSongs.length - 1) {
                playSong(indexSong + 1);
            } else {
                console.log('End of playlist');
                playSong(0)
            }
        };
    }
    axios.get(`http://localhost:8080/api/songs/listen/${song.id}`
    ).then(res => {
        console.log(res.data)

    })
    love.addEventListener('click', () => {
        axios.get(`http://localhost:8080/api/songs/likes/${song.id}`
        ).then(res => {
            updateLike(res.data.likes)
        })
    });
    document.getElementById("nextSong").addEventListener("click", function () {
        if (indexSong >= 0 && indexSong < currentSongs.length - 1) {
            playSong(indexSong + 1);

        }
    });
    document.getElementById("prevSong").addEventListener("click", function () {
        if (indexSong > 0) {
            playSong(indexSong - 1);
        }
    });
}

function playList() {
    localStorage.setItem('activeSongList', 'saveListSongs');
    document.getElementById('displayPlay').style.display = 'none';
    document.getElementById('pauseMusic').style.display = 'block';
    playSong(0);


}

function showSongByAuthorId() {
    album.style.display="block"
    Album()

    background_user.style.display = "none"
    forUser1.style.display = "none"
    document.getElementById("createAlbum").style.display="block"
    newBackground.style.display = "none";
    loginNav.style.display = "none";
    profileNav.style.display = "flex";
    playingBar.style.background = "#121212"
    home.style.opacity = "100%";
    authorBackground.style.display = "block"
    document.getElementById(`create-song-button`).style.display = `block`
    document.getElementById("author-title").innerHTML = `List Song`
    document.getElementById("home-page-title").innerHTML = `Author`
    document.getElementById(`search`).style.display = `none`
    axios.get(`http://localhost:8080/api/songs/${currentId}`).then(resp => {
        let data = resp.data
        let str = `<div class="App__section-grid-container">`
        for (const item of data) {
            str += `<div class="App__section-grid-item">
                <div>
                <img src="${item.album.avatar}" alt="avt"/></div>
                <div><h5>${item.name}</h5></div>
                <div style="margin-top: 5px"><h5>Singer: ${item.singer.name}</h5></div>
                <div style="margin-top: 5px"><h5>Category: ${item.category.name}</h5></div>
                <div class="grid-item-btn-gr">
                <button onclick="showEditSongForm(${item.id})">Edit</button>
                <button onclick="removeSong(${item.id})">Delete</button>    
                </div>   
            </div>`
        }
        str += '</div>'
        document.getElementById("author-song-item").innerHTML = str
    })
}

function showEditSongForm(id) {
    document.getElementById("author-title").innerHTML = `Edit Song`
    document.getElementById(`create-song-button`).style.display = `none`
    document.getElementById(`search`).style.display = `none`
    axios.get(`http://localhost:8080/api/songs/song/${id}`).then(resp => {
        axios.get(`http://localhost:8080/api/albums`).then(albums => {
            axios.get(`http://localhost:8080/api/singers`).then(singers => {
                axios.get(`http://localhost:8080/api/categories`).then(cates=>{
                    let str =
                        `<div class="column-left">
                <input type="hidden" id="song-id" value="${resp.data.id}">
                <input type="hidden" id="edit-song-src" value="${resp.data.src}">
                <input type="hidden" id="edit-song-likes" value="${resp.data.likes}">
                <input type="hidden" id="edit-song-listens" value="${resp.data.listens}">
                <label>Name:<input type="text" name="name" id="edit-song-name" value="${resp.data.name}"></label>
                <label>Note: <input type="text" name="note" id="edit-song-note" value="${resp.data.note}"></label
                <label>Choice Album:</label> 
                <select id="edit-album">`
                    for (const album of albums.data) {
                        str += `<option value="${album.id}">${album.name}</option>`
                    }
                    str += `</select>
                <label>Choice Singer:</label> 
                 <select id="edit-singer">`
                    for (const singer of singers.data) {
                        str += `<option value="${singer.id}">${singer.name}</option>`
                    }
                    str += `</select>
               <label>Choice Category:</label> 
                 <select id="edit-cate">`
                    for (const cate of cates.data) {
                        str += `<option value="${cate.id}">${cate.name}</option>`
                    }
                    str += `</select>
                </div>
                <div class="add-song-btn-gr">
                <button type="button" onclick="showSongByAuthorId()">Cancel</button>
                <button onclick="editSong()">Edit</button>
                </div>`
                    document.getElementById("author-song-item").innerHTML = str
                })
                })

        })
    })

}

function editSong() {
    let id = document.getElementById(`song-id`).value
    let data = {
        name: document.getElementById(`edit-song-name`).value,
        note: document.getElementById(`edit-song-note`).value,
        src:  document.getElementById(`edit-song-src`).value,
        likes:  document.getElementById(`edit-song-likes`).value,
        listens:  document.getElementById(`edit-song-listens`).value,
        album: {
            id: document.getElementById(`edit-album`).value
        },
        singer: {
            id: document.getElementById(`edit-singer`).value
        },
        category: {
            id: document.getElementById(`edit-catev`).value
        },
        author: {
            id: currentId
        },
    }
    axios.put(`http://localhost:8080/api/songs/${id}`, data).then(() => {
        showSongByAuthorId()
    })
}

function removeSong(id) {
    axios.delete(`http://localhost:8080/api/songs/${id}`).then(() => {
        showSongByAuthorId(currentId)
    })
}

function showAddSongForm() {
    document.getElementById("author-title").innerHTML = `Create New Song`
    document.getElementById(`create-song-button`).style.display = `none`
    document.getElementById(`search`).style.display = `none`
    axios.get(`http://localhost:8080/api/albums`).then(albums => {
        axios.get(`http://localhost:8080/api/singers`).then(singers => {
            axios.get(`http://localhost:8080/api/categories`).then(cates=>{
                let str =
                    `<div class="column-left">
                <label>Name:<input type="text" name="name" id="song-name"></label>
                <label>Note: <input type="text" name="note" id="song-note"></label>
                <label>Choice Album:</label> <select id="list-album">`
                for (const album of albums.data) {
                    str += `<option value="${album.id}">${album.name}</option>`
                }
                str += `</select>
                <label>Choice Singer:</label> <select id="list-singer">`
                for (const singer of singers.data) {
                    str += `<option value="${singer.id}">${singer.name}</option>`
                }
                str += `</select>
               <label>Choice Category:</label> <select id="list-cate">`
                for (const cate of cates.data) {
                    str += `<option value="${cate.id}">${cate.name}</option>`
                }
                str += `</select> 
                </div>
                <div class="song-data">
                <label>Song Data:</label>
                <input type="file" onchange="getImageData(event)" id="song-url">
                </div>
                <div class="add-song-btn-gr">
                <button type="button" onclick="showSongByAuthorId()">Cancel</button>
                <button onclick="addSong()" id="save-song-button" style="display: none">Save</button>
                </div>`
                document.getElementById("author-song-item").innerHTML = str
            })

        })
    })
}

function addSong() {
    let data = {
        name: document.getElementById("song-name").value,
        note: document.getElementById(`song-note`).value,
        src: songURl,
        album: {
            id: document.getElementById(`list-album`).value
        },
        singer: {
            id: document.getElementById(`list-singer`).value
        },
        category: {
            id: document.getElementById(`list-cate`).value
        },
        author: {
            id: currentId
        },
        likes: 0,
        listens: 0,
    }
    axios.post(`http://localhost:8080/api/songs`, data).then(() => {
        showSongByAuthorId()
    })
}

function Album() {
    axios.get('http://localhost:8080/api/albums/' + currentId, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(res => {
        const playlistList = document.getElementById("album-list");
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
        })

    })
}
