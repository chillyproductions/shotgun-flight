const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const cowBoyImg = new Image();
cowBoyImg.src = "./assets/cowboy.png";
const shotGunImg = new Image();
shotGunImg.src = "./assets/shotgun.png";
const bulletImg = new Image();
bulletImg.src = "./assets/shell.png";

const shellSound = new Audio();
shellSound.src = './assets/shell.mp3';
const shootSound = new Audio();
shootSound.src = './assets/shoot.mp3';

const shotgunForce = 100;
const playerSize = 60;

var bullets = [];
var player = new Player((canvas.width-playerSize)/2 ,(canvas.height-playerSize)/2,playerSize);
var score = 0;
var resetable = false;

document.addEventListener('keydown',({key})=>{
    if(key == " " && resetable)
        start();
        
})

document.addEventListener('mousedown',(evt)=>{
    player.shoot(evt.pageX - canvas.getBoundingClientRect().x, evt.pageY - canvas.getBoundingClientRect().y);
})

document.addEventListener('mousemove',(evt)=>{
    player.changeAng(evt.pageX - canvas.getBoundingClientRect().x, evt.pageY - canvas.getBoundingClientRect().y);
})


function start(){
    player = new Player((canvas.width-playerSize)/2 ,(canvas.height-playerSize)/2,playerSize);
    score = -1;
    resetble = false;
    updateScore();

    for(let i = 0; i < 2; i++)
        bullets[i] = createNewBullet(i);

    var timer = getTime();
    var loop = window.setInterval(()=>{
        ctx.clearRect(0,0,canvas.width,canvas.height);
    
        player.move(getTime()-timer);
        player.draw();

        for(let bullet of bullets){
            bullet.draw();
            bullet.collision();
        }

        if(player.death()){
            clearInterval(loop);
            alert('u dead:/ score: ' + score);
            resetable = true;
        }
        
        timer = getTime();
    },0)
}

function updateBullets(){
    document.getElementById('bullets').innerText = player.bullets;
}

function updateScore(){
    score++;
    document.getElementById('score').innerText = "score: " + score;
}

function createNewBullet(id){
    function Random(max){
        return Math.floor(Math.random()*(max-playerSize+1));
    }
    return new Bullet(Random(canvas.width),Random(canvas.height),id);
}

function getTime(){
    return new Date().getTime();
}

start();


