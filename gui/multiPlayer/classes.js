class rect{
    constructor(x,y,w,h){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    draw(){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x,this.y,this.size,this.size);
    }

    getDots(){
        const x = this.x;
        const y = this.y;
        const w = this.w;
        const h = this.h;
        const ang = 0;
        
        var dots = [{x:x,y:y},
        {x:x + w * Math.cos(ang), y:y + w * Math.sin(ang)},
        {x:x - h * Math.sin(ang), y:y + h * Math.cos(ang)}];

        var middleX = (dots[1].x + dots[2].x) / 2;
        var middleY = (dots[1].y + dots[2].y) / 2;
        
        dots.push(dots[2]);
        dots[2] = {x:2*middleX - x, y:2*middleY-y};
        return dots;
    }



    getAxes(){
        function intoAxis(d1,d2){
            let axis = {y:d1.x-d2.x, x:d2.y-d1.y};
            let d = Math.sqrt(axis.y*axis.y + axis.x*axis.x);
            if(d==0)
                return axis;
            axis.y /= d;
            axis.x /= d;
            return axis;
        }

        const dots = this.getDots();


        var axes = [];
        for(let i = 0; i < dots.length; i++){
            if(i == dots.length-1){
                axes.push(intoAxis(dots[i],dots[0]));
                continue;
            }
            axes.push(intoAxis(dots[i],dots[i+1]));
        }
        
        return axes;
    }

    project(axis,dot){
        return axis.x*dot.x + axis.y*dot.y; 
    }

    collision(shape){
        var axes = this.getAxes();
        axes = [...axes, ...shape.getAxes()];
        for(let axis of axes){
            var myMin = Number.MAX_VALUE;
            var myMax = -Number.MAX_VALUE;
            for(let dot of this.getDots()){
                let currlength = this.project(axis,dot);
                myMin = Math.min(myMin, currlength);
                myMax = Math.max(myMax, currlength);
            }
            var otherMin = Number.MAX_VALUE;
            var otherMax = -Number.MAX_VALUE;;
            for(let dot of shape.getDots()){
                let currlength = this.project(axis,dot);
                otherMin = Math.min(otherMin, currlength);
                otherMax = Math.max(otherMax, currlength);
            }
            if(myMax < otherMin || otherMax < myMin){
                return false;
            }
        }
        return true;
    }
}


class Bullet extends rect{
    color = "goldenrod";
    constructor(x,y,id){
        super(x,y,15,30)
        this.id = id;
    }
    draw(){
        ctx.drawImage(bulletImg,this.x,this.y,this.w,this.h)
    }

    collision(){
        if(super.collision(player)){
            player.bullets++;
            updateBullets();
            shellSound.play();
            bullets[this.id] = null;
            socket.emit('bullet-eat', this.id);
        }
    }
}

class Player extends rect{
    color = "black";
    speed = {x:0, y:0};
    bullets = 5;
    gunAng = 0;
    img;

    constructor(x,y,size,img){
        super(x,y,size,size);
        this.size = size;
        this.img = img;
    }

    shoot(x,y){
        if(this.bullets > 0){
            const distance = Math.sqrt((this.x - x)*(this.x - x) + (this.y - y)*(this.y - y));
            this.speed.x = (this.x - x) / distance * shotgunForce;
            this.speed.y = (this.y - y) / distance * shotgunForce;
            this.bullets--;
            updateBullets();
            shootSound.play();
        }
    }

    changeAng(x,y){
        if(this.x < x)
            this.gunAng = Math.atan((this.y-y)/(this.x-x));
        else
            this.gunAng = Math.atan((this.y-y)/(this.x-x)) + Math.PI;
    }

    draw(){
        ctx.drawImage(this.img,this.x,this.y,this.size,this.size);
        if(this.x + this.size > canvas.width)
            ctx.drawImage(this.img,this.x - canvas.width,this.y,this.size,this.size);
            
        else if(this.x < 0)
            ctx.drawImage(this.img,canvas.width+this.x,this.y,this.size,this.size);
        
        ctx.save();
        ctx.translate(this.x + this.size,this.y + this.size/2);
        ctx.rotate(this.gunAng);
        ctx.drawImage(shotGunImg,0,0,this.size*2,this.size)
        ctx.restore();
    }


    move(dt){
        dt = dt/100;

        this.speed.y += 12 * dt; 
        
        this.x += this.speed.x * dt; 
        this.y += this.speed.y * dt;
        if(this.x >= canvas.width)
            this.x = 0;
        
        else if(this.x + this.size <= 0)
            this.x = canvas.width -this.size;
    }

    death(){
        if(this.y >= canvas.height + 30)
            return true;
        return false;
    }
}