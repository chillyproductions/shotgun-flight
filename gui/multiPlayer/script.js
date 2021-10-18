const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const cowBoyImg = new Image();
cowBoyImg.src = "../assets/cowboy.png";
const shotGunImg = new Image();
shotGunImg.src = "../assets/shotgun.png";
const bulletImg = new Image();
bulletImg.src = "../assets/shell.png";

const shellSound = new Audio();
shellSound.src = '../assets/shell.mp3';
const shootSound = new Audio();
shootSound.src = '../assets/shoot.mp3';

const shotgunForce = 100;
const playerSize = 60;

var bullets = [];
var player;
var enemyPlayer;
var loop;

function shoot(evt){
    player.shoot(evt.pageX - canvas.getBoundingClientRect().x, evt.pageY - canvas.getBoundingClientRect().y);
}
function change(evt){
    player.changeAng(evt.pageX - canvas.getBoundingClientRect().x, evt.pageY - canvas.getBoundingClientRect().y);
}

function startListening(){
    stopListening();
    document.addEventListener('mousedown',shoot)
    document.addEventListener('mousemove',change)
}

function stopListening(){
    document.removeEventListener('mousedown',shoot);
    document.removeEventListener('mousemove',change);
}

function startGame(){
    resetValues();

    var timer = getTime();
    loop = window.setInterval(()=>{
        ctx.clearRect(0,0,canvas.width,canvas.height);
    
        player.move(getTime()-timer);
        player.draw();
        enemyPlayer.draw();

        for(let bullet of bullets){
            bullet.draw();
            bullet.collision();
        }

        if(player.death()){
            clearInterval(loop);
            document.getElementById('bullets').innerHTML = "You lost:(";
            document.getElementById('bullets').style.color = 'red';
            document.getElementById('bullets').style.opacity = 1;
            document.getElementById('bullets').style.fontSize = '75px';
            stopListening();
            socket.emit('death');
        }
        
        timer = getTime();
    },0)
}

function resetValues(){
    startListening();
    document.getElementById('bullets').style.color = 'black';
    document.getElementById('bullets').style.opacity = 0.5;
    document.getElementById('bullets').style.fontSize = '150px';
    updateBullets();
}

function updateBullets(){
    document.getElementById('bullets').innerText = player.bullets;
}

function getTime(){
    return new Date().getTime();
}


