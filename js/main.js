"use strict";

var game, frameBuffer, obj_player;
var entities = [];

var leftKey,rightKey,upKey,downKey,shootKey,swapKey,aKey,dKey;

var snd_shoot,snd_explode,snd_meow;

var CAMDIR = 0;
var CAMX=16000;
var CAMY=16000;
var CAMZ=0;

var CAMMAPX = 0
var CAMMAPY = 0
var CAMDIST = 180;
var CACTUS_TILESIZE = 800;
var SCREEN_SHAKE = 0;


function degstorads(degs) 
//Given Degrees, Return Radians
{
    return degs * (Math.PI/180);
}

function clamp(val,min,max)
{
    if (val<min)
        return min;
    if (val>max)
        return max;
    return val;
}

function lengthdir_x(len,dir)
//given a length and an angle (in Degrees), return the horizontal (x) component of 
//the vector of the angle and direction
{
    return len * Math.cos(degstorads(dir));
}

function lengthdir_y(len,dir)
// Performs the same function as lengthdir_x, but returns the vertical component
{
    return len * Math.sin(degstorads(dir));

}

function point_distance(x1,y1,x2,y2) 
// Returns the distance between two points
// will be used to perform circle collisions
{
    var xdif = x1-x2;
    var ydif = y1-y2;
    return Math.sqrt(xdif*xdif+ydif*ydif);
}

function point_direction(x1,y1,x2,y2)
// return as a degree the angle between two points
{
    var xdif = x2 - x1;
    var ydif = y2 - y1;

    return Math.atan2(ydif,xdif)*180 / Math.PI;
}

var SEED;
function rand()
// random number generator for javascript that I found on stackoverflow,
// because you apparently can't seed javascripts built in rng
// found here: http://stackoverflow.com/questions/521295/javascript-random-seeds
{
    var rand = Math.sin(++SEED)*10000;
    //return 1/2;
    return rand - Math.floor(rand);

}

function szudzkik(x,y)
// pairing function
{
    if (x<y)
        return y*y+x;
    else
        return x*x+x+y;
}

function entityDestroy(i)
// destroys the entities Phaser image and removes it from the entity list
{
    entities[i].PhSprite.destroy();
    entities.splice(i,1);
}

function entityCreate(ent)
//adds an entity to the entity list 
{
    entities.push(ent);
}

function entity(x,y,dir,sprite) 
{
    this.x = x;
    this.y = y;
    this.dir = dir;
    this.sprite = sprite;
    this.speed = 0;
    this.angle = 0;
    this.alive = true;

    this.PhSprite = game.make.image(0,150+CAMZ,this.sprite);
    this.PhSprite.anchor.setTo(0.5,0.5);
    this.PhSprite.smoothed = false;
    this.PhSprite.angle = this.angle;

    //variables for projecting the sprites in 3d
    this.xv = 0;
    this.yv = 0;
    this.dist = point_distance(CAMX,CAMY,this.x,this.y);
    this.offset = 0;
    this.scale = 0;
    this.fadeIn = 0;

    this.step = function()
    {

    }

    this.update = function()
    {
        this.dist = point_distance(CAMX,CAMY,this.x,this.y);
    }

    this.moveToDir = function()
    {
        this.x+=lengthdir_x(this.speed,this.dir);
        this.y+=lengthdir_y(this.speed,this.dir);
    }

    this.draw = function()
    {

        if (this.fadeIn<1)
        {
            this.fadeIn+=0.1;
        }
       
        this.xv = this.x - CAMX;
        this.yv = this.y - CAMY;

        this.offset = Math.atan2(this.yv,this.xv) - degstorads(CAMDIR);
        this.scale = (CAMDIST / (Math.cos(this.offset) * this.dist))*this.fadeIn;
        if (this.scale<=0)
            return;

        this.PhSprite.x = 200+Math.tan(this.offset)*CAMDIST-this.scale/2;
        this.PhSprite.y = 150+CAMZ;
        this.PhSprite.scale.setTo(this.scale,this.scale);
        this.PhSprite.tint = Phaser.Color.interpolateColor(0xffffff,0x000000,3500,clamp(this.dist,0,3500),1);
        
        frameBuffer.draw(this.PhSprite);
    }

}

function cactus(x,y)
{
    var parent = new entity(x,y,0,'cactus');
    for (var i in parent)
        this[i] = parent[i];

    this.fadeIn = 1;
}

function tank(x,y)
{
    var parent = new entity(x,y,0,'tank');
    for (var i in parent)
        this[i] = parent[i];

    this.angle = point_direction(this.x,this.y,CAMX,CAMY);

    this.step = function()
    {

        this.angle = point_direction(this.x,this.y,CAMX,CAMY)+Math.random()*60-30;

        if (this.dist < 320)
        {
            this.speed=1;
            if ( Math.random()<0.05) 
            {
                this.dir = Math.random()*360;
                
            }

            if ( Math.random()<0.01) 
                entityCreate( new bullet(this.x,this.y,this.angle+Math.random()*8-4,8,this.speed,1) );

        }
        else
        {
            this.speed = 5;
            this.dir = this.angle;
        }
        

        for( var i in entities)
            if (entities[i] instanceof bullet && entities[i].alive===true && entities[i].target===0)
                if ( point_distance(this.x,this.y,entities[i].x,entities[i].y)<32)
                {
                    this.alive = false;
                    entities[i].alive = false;
                    SCREEN_SHAKE+=8;
                    snd_explode.play();
                }
        this.moveToDir();
    }

}

function bullet(x,y,dir,speed,lspeed,target)
{
    var parent = new entity(x,y,0,'bullet');
    for (var i in parent)
        this[i] = parent[i];

    this.xspeed = lengthdir_x(speed+lspeed,dir);
    this.yspeed = lengthdir_y(speed+lspeed,dir);
    this.life = 300;
    this.fadeIn = 1;
    this.target = target

    console.log("MAKE BULLET");

    this.step = function()
    {
        this.life--;
        if (this.life<=0)
            this.alive = false;

        this.PhSprite.angle+=6;
        this.x+=this.xspeed;
        this.y+=this.yspeed;

    }
}

function player(x,y)
{
    this.x=x;
    this.y=y;
    this.speed=0;
    this.dir=0;
    this.gundir=0;
    this.cat=0;
    this.canSwap = true;
    this.canShoot = true
    this.shootTimer = 0;

    this.moveToDir = function()
    {
        this.x+=lengthdir_x(this.speed,this.dir);
        this.y+=lengthdir_y(this.speed,this.dir);
    }

    this.step  = function()
    {

        if (swapKey.isDown && this.canSwap)
        {
            this.canSwap = false;

            if (this.cat<1)
                this.cat++;
            else
                this.cat = 0;

            snd_meow.play();
        }
        if (!this.canSwap && swapKey.isUp)
        {
            this.canSwap = true;
        }
        if (this.cat === 0 )
        {
            //driving cat
            if (upKey.isDown)
            {
                this.speed+=0.1;
            }
            if (downKey.isDown)
            {
                if (this.speed>-1)
                    this.speed-=0.1;
            }
            if (leftKey.isDown)
            {
                this.dir--;
            }
            if (rightKey.isDown)
            {
                this.dir++;
            }
        }
        
        if (this.cat === 0 )
        {
            //cannon cat
            if (aKey.isDown)
            {
                this.gundir-=2;
            }
            if (dKey.isDown)
            {
                this.gundir+=2;
            }
            if (shootKey.isDown && this.canShoot)
            {
                entityCreate( new bullet(this.x,this.y,this.gundir+Math.random()*8-4,8,this.speed,0) );
                this.canShoot = false;
                this.shootTimer = 16;
                SCREEN_SHAKE += 4;
                snd_shoot.play();

            }
        }
        else 
        if (this.cat === 2 )
        {
            //reload cat
        }
        else 
        if (this.cat === 3 )
        {
            // mine defuser cat
        }

        if (this.speed>3)
            this.speed = 3;

        if (this.shootTimer>0)
        {
            this.shootTimer--;
        }
        else 
        {
            this.canShoot = true;
            this.shootTimer = 0
        }

        if (this.speed<0)
            this.speed+=0.01


        for( var i in entities)
            if (entities[i] instanceof bullet && entities[i].alive===true && entities[i].target===1)
                if ( point_distance(this.x,this.y,entities[i].x,entities[i].y)<32)
                {
                    entities[i].alive = false;
                    SCREEN_SHAKE+=16;
                    snd_explode.play();
                }

        this.moveToDir();
    }

    this.draw = function()
    {
        if (this.cat===1)
        {
            CAMZ = 32;
        }
        else
        {
            CAMZ = 0;
        }

        CAMDIR = this.gundir;

        CAMX = this.x;
        CAMY = this.y;

    }
}

function manageCacti()
{
    if( ~~(CAMX/CACTUS_TILESIZE)!==CAMMAPX || ~~(CAMY/CACTUS_TILESIZE)!==CAMMAPY )
    {
        CAMMAPX = ~~(CAMX/CACTUS_TILESIZE);
        CAMMAPY = ~~(CAMY/CACTUS_TILESIZE);

        var e = entities.length;
        while(e--)
        {
            if (entities[e] instanceof cactus)
            {
                entityDestroy(e);
            }
        }

        for(var x = CAMMAPX-2; x<=CAMMAPX+2; x++)
            for(var y = CAMMAPY-2; y<=CAMMAPY+2; y++)
            {
                SEED = szudzkik(Math.abs(x),Math.abs(y));
                for(var i = 0; i<4; i++)
                {
                    entityCreate(new cactus(x*CACTUS_TILESIZE+rand()*CACTUS_TILESIZE,y*CACTUS_TILESIZE+rand()*CACTUS_TILESIZE) );
                }
            }
    }
}
var tanks = 0;
function manageTanks()
{
    if (Math.random()<0.005 && tanks<15)
    {
        tanks++;
        entityCreate(new tank(obj_player.x+lengthdir_x(1000,Math.random()*360),obj_player.y+lengthdir_y(1000,Math.random()*360) ) );
    }
}

function drawSun()
{
    var offset = Math.atan2(10,10) - degstorads(CAMDIR);
    var scale = CAMDIST / (Math.cos(offset) * 1000);
    if (scale<0)
        return;
    frameBuffer.circle(200+Math.tan(offset)*CAMDIST-scale/2,64,32,'#ffffff');
}

window.onload = function() {

	//	Create your Phaser game and inject it into the gameContainer div.
	//	We did it in a window.onload event, but you can do it anywhere (requireJS load, anonymous function, jQuery dom ready, - whatever floats your boat)
	game = new Phaser.Game(1000, 600, Phaser.AUTO, 'gameContainer');	
	game.antialias = false;
	//	Add the States your game has.
	//	You don't have to do this in the html, it could be done in your Boot state too, but for simplicity I'll keep it here.
	game.state.add('Boot', BasicGame.Boot);
	game.state.add('Preloader', BasicGame.Preloader);
	game.state.add('MainMenu', BasicGame.MainMenu);
	game.state.add('Game', BasicGame.Game);

	//	Now start the Boot state.
	game.state.start('Boot');

};
