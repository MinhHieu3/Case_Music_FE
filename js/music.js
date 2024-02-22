const firebaseConfig = {
    apiKey: "AIzaSyBdDYDur5mbq0klC3RNQRpLKUkoN7hT-Nc",
    authDomain: "test-91e51.firebaseapp.com",
    projectId: "test-91e51",
    storageBucket: "test-91e51.appspot.com",
    messagingSenderId: "477003899691",
    appId: "1:477003899691:web:9385956cfd07fcb8475b6e",
    measurementId: "G-34JPQ74YJ9"
};

const app = firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();
let file;
let fileName;
let uploadedFileName;
let imageURL;
const getImageData = (e) => {
    file = e.target.files[0];
    fileName = Math.round(Math.random() * 9999) + file.name;
    const storageRef = storage.ref().child("music");
    const folderRef = storageRef.child(fileName);
    const uploadtask = folderRef.put(file);
    uploadtask.on(
        "state_changed",
        (snapshot) => {
            uploadedFileName = snapshot.ref.name;
        },
        (error) => {
            console.log(error);
        },
        () => {
            storage
                .ref("music")
                .child(uploadedFileName)
                .getDownloadURL()
                .then((url) => {
                    console.log(url)
                    imageURL = url;
                });
        }
    );
};



axios.get('http://localhost:8080/api/songs').then(res => {
    const card = document.getElementById("card");
    const control = document.getElementById("control");
    const love = document.getElementById("love");
    card.innerHTML = '';
    let songCount = 0;
    let songIndex=-1;
    let indexs=-1;
    const songs=res.data
     function playSong(index) {
         if (index < 0 || index >= songs.length) return;
         songIndex = index;
         const song = songs[index];
         toggleAudio(song.src,song.name,song.singer.name,song.album.avatar)
         updateLike(song.likes)
         axios.get(`http://localhost:8080/api/songs/listen/${song.id}`
         ).then(res=>{
             console.log(res.data)

         })


     }
    document.getElementById("nextSong").addEventListener("click", function() {
        if (songIndex >= 0 && songIndex < songs.length - 1) {
            playSong(songIndex + 1);

        }
    });
    document.getElementById("prevSong").addEventListener("click", function() {
        if (songIndex > 0) {
            playSong(songIndex - 1);
        }
    });
    songs.forEach ((item,index) =>{
        const songDiv = document.createElement("div");
        songDiv.className = "App__section-grid-item";
        songDiv.innerHTML = `
            <div class="featured-image"></div> 
            <div class="song-name">${item.name}</div>
            <span>${item.singer.name}</span>
        `;
        songDiv.querySelector('.song-name').addEventListener('click', () =>{
            playSong(index)

            control.style.display='block';
            love.style.display='block';
            indexs=`${item.id}`;
        });
        card.appendChild(songDiv);
        songCount++;

    });
    love.addEventListener('click', ()=>{
        axios.get(`http://localhost:8080/api/songs/like/${indexs}`
        ).then(res=>{
            updateLike(res.data.likes)

        })
    });

});

