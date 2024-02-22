 function editProfile() {
    var newBackground = document.getElementById("formEdit");
    newBackground.style.display="block";
    document.getElementById("profiles").style.display="none";
}
 function profile() {
    var newBackground = document.getElementById("profiles");
    newBackground.style.display="block";

}
 function backHome(){
    document.getElementById("profiles").style.display="none";
    document.getElementById("originnal-backround").style.display="block";

 }
 function backProfile(){
     document.getElementById("formEdit").style.display="none";
     document.getElementById("profiles").style.display="block";
 }