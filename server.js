const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

var players = {};
var rooms = {};

io.on('connection', socket=>{
    socket.on('join-room', ({name, room})=>{
        socket.join(room);
        players[socket.id] = {name:name, room:room};
        
        if(!rooms[room])
            return
        
        if(rooms[room].players.length == 1)
            rooms[room].players.push({name:name,position:{x:600,y:400},score:0});
        else if(rooms[room].players.length == 0)
            rooms[room].players.push({name:name,position:{x:200,y:400},score:0});

        io.to(room).emit('new-players',rooms[room].players);
    })

    socket.on('start', ()=>{
        if(!players[socket.id]) return;
        
        io.to(players[socket.id].room).emit('start',rooms[players[socket.id].room]);
    })
    
    socket.on('player-move',(data)=>{
        if(!players[socket.id]) return;
        
        socket.to(players[socket.id].room).emit('player-move',data);
    })
    
    socket.on('death', ()=>{
        if(!players[socket.id]) return;
        
        for(var player of rooms[players[socket.id].room].players)
            if(player.name != players[socket.id].name)
                player.score++;
        
        socket.to(players[socket.id].room).emit('death');
        io.to(players[socket.id].room).emit('get-scores',rooms[players[socket.id].room].players);
    })
    
    socket.on('bullet-eat', (id)=>{
        if(!players[socket.id]) return;
        
        io.to(players[socket.id].room).emit('bullet-eat', createNewBullet(id));
    })
})

app.get('/createLobby', (req,res)=>{
    var code = generateCode(5);
    while(rooms[code])
        code = generateCode(5);

    rooms[code] = {started: false, players:[],bullets:generateBullets(3)};
        
    res.send(code);
})

app.use(express.static('./gui'))

http.listen(process.env.PORT || 3000);

function generateCode(length){
    const abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var code = "";
    for(let i = 0; i < length; i++){
        code += abc[Math.floor(Math.random()*abc.length)];
    }
    return code;
}


function generateBullets(amount){
    var bullets = [];
    for(let i = 0; i < amount; i++){
        bullets.push(createNewBullet(i));
    }
    return bullets
}

function createNewBullet(id){
    function Random(max){
        return Math.floor(Math.random()*(max-60+1));
    }
    return [Random(750),Random(750),id];
}