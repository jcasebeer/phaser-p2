"use strict";

var game, frameBuffer, obj_player;
var entities = [];

var leftKey,rightKey,upKey,downKey,shootKey,swapKey;

var CAMDIR = 0;
var CAMX=16000;
var CAMY=16000;
var CAMZ=0;

var CAMMAPX = 0
var CAMMAPY = 0
var CAMDIST = 180;
var CACTUS_TILESIZE = 800;

function degstorads(degs) 
//Given Degrees, Return Radians
{
    return degs * (Math.PI/180);
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
    this.dist = 0;
    this.offset = 0;
    this.scale = 0;
    this.fadeIn = 0;


    this.step = function()
    {

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

        this.dist = point_distance(CAMX,CAMY,this.x,this.y);
        this.offset = Math.atan2(this.yv,this.xv) - degstorads(CAMDIR);
        this.scale = (CAMDIST / (Math.cos(this.offset) * this.dist))*this.fadeIn;
        if (this.scale<0)
            return;

        this.PhSprite.x = 200+Math.tan(this.offset)*CAMDIST-this.scale/2;
        this.PhSprite.y = 150+CAMZ;
        this.PhSprite.scale.setTo(this.scale,this.scale);
        
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

function player(x,y)
{
    this.x=x;
    this.y=y;
    this.speed=0;
    this.dir=0;
    this.gundir=0;
    this.cat=0;
    this.canSwap = true;

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

            if (this.cat<3)
                this.cat++;
            else
                this.cat = 0;
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
                if (this.speed>0)
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
        else 
        if (this.cat === 1 )
        {
            //cannon cat
            if (leftKey.isDown)
            {
                this.gundir--;
            }
            if (rightKey.isDown)
            {
                this.gundir++;
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

        if (this.speed>4)
            this.speed = 4;
        this.moveToDir();
    }

    this.draw = function()
    {
        if (this.cat===1)
        {
            CAMDIR = this.gundir;
            CAMZ = 32;
        }
        else
        {
            CAMDIR = this.dir;
            CAMZ = 0;
        }

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
