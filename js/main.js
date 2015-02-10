"use strict";

var game, frameBuffer;
var entities = [];

var CAMDIR = 0;
var CAMX=1600;
var CAMY=1600;
var CAMDIST = 180;

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
    return rand - Math.floor(rand);
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

    this.PhSprite = game.make.image(0,150,this.sprite);
    this.PhSprite.anchor.setTo(0.5,0.5);
    this.PhSprite.smoothed = false;
    this.PhSprite.angle = this.angle;

    console.log("Entity Create!");

    //variables for projecting the sprites in 3d
    this.xv = 0;
    this.yv = 0;
    this.dist = 0;
    this.offset = 0;
    this.scale = 0;


    this.step = function()
    {
        console.log("Entity Step!");
    }

    this.moveToDir = function()
    {
        this.x+=lengthdir_x(this.speed,this.dir);
        this.y+=lengthdir_y(this.speed,this.dir);
    }

    this.draw = function()
    {
       
        this.xv = this.x- CAMX;
        this.yv = this.y- CAMY;

        this.dist = point_distance(CAMX,CAMY,this.x,this.y);
        this.offset = Math.atan2(this.yv,this.xv) - degstorads(CAMDIR);
        this.scale = CAMDIST / (Math.cos(this.offset) * this.dist);
        if (this.scale<0)
            return;
        //var rx = Math.tan(offset) * CAMDIST

        this.PhSprite.x = 200+Math.tan(this.offset)*CAMDIST-this.scale/2;
        this.PhSprite.scale.setTo(this.scale,this.scale);
        
        frameBuffer.draw(this.PhSprite);
    }

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
