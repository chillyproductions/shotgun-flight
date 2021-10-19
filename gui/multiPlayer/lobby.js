const socket = io();

function start(){
    socket.on('new-players', (players)=>{
        document.getElementById('player-container').innerText = ""; 
        for(var player of players){
            document.getElementById('player-container').innerHTML += `<div>${player.name}</div>`; 
        }
    });
    socket.on('start', (roomData)=>{
        document.getElementById('lobby-container').style.display = 'none';
        document.getElementById('active-game-container').style.display = 'inline';

        bullets = [];
        document.getElementById('scores').innerHTML = `<div>${roomData.players[0].name}: ${roomData.players[0].score}</div><div>${roomData.players[1].name}: ${roomData.players[1].score}</div>`;
        for(var bullet of roomData.bullets){
            bullets.push(new Bullet(bullet[0],bullet[1],bullet[2]));
        }
        if(localStorage.getItem('name') == roomData.players[0].name){
            player = new Player(roomData.players[0].position.x,roomData.players[0].position.y,playerSize,cowBoyImg);
            enemyPlayer = new Player(roomData.players[1].position.x,roomData.players[1].position.y,playerSize,purpelCowBoyImg);
        }
        else{
            player = new Player(roomData.players[1].position.x,roomData.players[1].position.y,playerSize,cowBoyImg);
            enemyPlayer = new Player(roomData.players[0].position.x,roomData.players[0].position.y,playerSize,purpelCowBoyImg);
        }

        document.removeEventListener('keypress',checkStart);
        startGame();
    })

    socket.on('player-move',({position,speed})=>{
        enemyPlayer.x = position[0];
        enemyPlayer.y = position[1];
        enemyPlayer.speed = speed;
    })

    socket.on('bullet-eat', (bullet)=>{
        bullets[bullet[2]] = new Bullet(bullet[0],bullet[1],bullet[2]);
    })

    socket.on('death', (players)=>{
        clearInterval(loop);
        document.getElementById('bullets').innerHTML = "You win:) <br> space for rematch";
        document.getElementById('bullets').style.color = 'red';
        document.getElementById('bullets').style.opacity = 1;
        document.getElementById('bullets').style.fontSize = '75px';
        document.addEventListener('keypress',checkStart);
        stopListening();
    });
    
    socket.on('get-scores',(players)=>{
        document.getElementById('scores').innerHTML = `<div>${players[0].name}: ${players[0].score}</div><div>${players[1].name}: ${players[1].score}</div>`;
    })

    var room = localStorage.getItem('room');
    if(room == "LIGMQ"){
        document.getElementById('id-container').innerText = "Ligma balls lmaooo";
        document.getElementById('id-container').style.fontSize = "100px";
    }

    else    
        document.getElementById('id-container').innerText = room;
    socket.emit('join-room',({name:localStorage.getItem("name"),room:localStorage.getItem('room')}));
}

function emitStart(){
    socket.emit('start');
}

start();