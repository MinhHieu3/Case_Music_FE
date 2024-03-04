const song = JSON.parse(localStorage.getItem('indexSong'))
const savedSongs = JSON.parse(localStorage.getItem('songs'))
const idSongs = JSON.parse(localStorage.getItem('idSong'))
Songs('http://localhost:8080/api/songs/top')

function ShowList() {
    Songs('http://localhost:8080/api/songs')
}

function Songs(url) {
    axios.get(url).then(res => {
        const card = document.getElementById("card");

        card.innerHTML = '';
        res.data.forEach((item, index) => {
            const songDiv = document.createElement("div");
            songDiv.className = "App__section-grid-item";
            songDiv.innerHTML = `
            <div style="height: 136px" class=""><img src="${item.album.avatar}" alt=""></div>
            <div class="song-name">${item.name}</div>
            <span>${item.singer.name}</span>
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
        love.addEventListener('click', () => {
            axios.get(`http://localhost:8080/api/songs/like/${item.id}`
            ).then(res => {
                updateLike(res.data.likes)
            })
        });
    });
}


showTop5NewSong('http://localhost:8080/api/songs/top5-new-song')
function showTop5NewSong(url){
    axios.get(url).then(res => {
        console.log(res)
        const song = document.getElementById("top5-new-song");
        song.innerHTML = '';
        res.data.forEach((item, index) => {
            const songDivs = document.createElement("div");
            songDivs.className = "App__section-grid-item";
            songDivs.innerHTML = `
            <div style="height: 136px" class=""><img src="${item.album.avatar}" alt=""></div>
            <div class="song-name">${item.name}</div>
            <span>${item.singer.name}</span>
        `;
            songDivs.querySelector('.song-name').addEventListener('click', function () {
                localStorage.setItem('activeSongList', 'savedSongs');
                localStorage.setItem('songs', JSON.stringify(res.data));
                localStorage.setItem('activeSongList', 'savedSongs');
                localStorage.setItem('idSong', JSON.stringify(`${item.id}`))
                playSong(index)

            });
            song.appendChild(songDivs);
        });
        love.addEventListener('click', () => {
            axios.get(`http://localhost:8080/api/songs/like/${idSongs}`
            ).then(res => {
                updateLike(res.data.likes)
            })
        });
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
    console.log("check", currentSongs)
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
    loginNav.style.display = "none";
    profileNav.style.display = "flex";
    playingBar.style.background = "#121212"
    forUser.style.display = "none"
    forUser1.style.display = "none"
    newBackground.style.display = "none";
    home.style.opacity = "100%";
    backUser.style.display = "none"
    authorBackground.style.display = "block"
    document.getElementById(`create-song-button`).style.display = `block`
    document.getElementById("author-title").innerHTML = `List Song`
    document.getElementById("home-page-title").innerHTML = `Author`
    document.getElementById(`search`).style.display = `none`
    axios.get(`http://localhost:8080/api/songs/${currentId}`).then(resp => {
        console.log(resp.data)
        let data = resp.data
        let str = `<div class="App__section-grid-container">`
        for (const item of data) {
            str += `<div class="App__section-grid-item">
                <div>
                <img src="${item.album.avatar}" alt="avt"/></div>
                <div><h5>${item.name}</h5></div>
                <div><h5>${item.singer.name}</h5></div>
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
                </div>
                <div class="add-song-btn-gr">
                <button type="button" onclick="showSongByAuthorId()">Cancel</button>
                <button onclick="editSong()">Edit</button>
                </div>`
                document.getElementById("author-song-item").innerHTML = str
            })
            console.log(`${resp.data.id}`)
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