let backgroundSearch = document.getElementById('background-search')


function openSearchBox() {
    background_user.style.display = 'none';
    backgroundSearch.style.display = 'block';
    background_create_playlist.style.display = 'none';
    dataSong1(url)
}

function searchSong1() {
    let search = document.getElementById('searchSong1').value;
    if (search !== null) {
        dataSong1(`http://localhost:8080/api/songs/search/v2?search=${search}`)
    }
}

function dataSong1(url) {
    axios.get(url).then(res => {
        console.log("data", res.data);
        let str = ` <table class="all-song-tb">
                            <tr class="all-song-thead">
                                <th></th>
                            <th>Name Song</th>
                            <th>Singer</th>
                            <th>Album</th>
                             <th>Category</th>
                        
                            </tr>`;
        res.data.forEach((item, index) => {
            str += `<tr class="all-song-tbody" onclick="playSong(${index})">
                                <td><img src="${item.album.avatar}" style="width: 50px;height: 50px;margin-top: 10px;margin-left: 30px"></td>
                                <td>${item.name}</td>
                                <td>${item.singer.name}</td>
                                <td>${item.album.name}</td>
                                <td>${item.category.name}</td>
                             
                            </tr>`
            localStorage.setItem('activeSongList', 'savedSongs');
            localStorage.setItem('songs', JSON.stringify(res.data));
            localStorage.setItem('activeSongList', 'savedSongs');
            localStorage.setItem('idSong', JSON.stringify(`${item.id}`))
        })
        str += `</table>`;
        document.getElementById(`show1`).innerHTML = str;
    })
}