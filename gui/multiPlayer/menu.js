async function createRoom(){
    var room = await fetch('/createLobby');
    room = await room.text();
    localStorage.setItem("name",document.getElementById("name").value);
    localStorage.setItem('room', room);
    location.href += "lobby.html";
}

function join(){
    localStorage.setItem("name",document.getElementById("name").value);
    localStorage.setItem('room', document.getElementById('room').value);
    location.href += "lobby.html";
}

