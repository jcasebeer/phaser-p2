"use strict";
BasicGame.Game = function (game) {

    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;      //  a reference to the currently running game (Phaser.Game)
    this.add;       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
    this.camera;    //  a reference to the game camera (Phaser.Camera)
    this.cache;     //  the game cache (Phaser.Cache)
    this.input;     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
    this.load;      //  for preloading assets (Phaser.Loader)
    this.math;      //  lots of useful common math operations (Phaser.Math)
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
    this.stage;     //  the game stage (Phaser.Stage)
    this.time;      //  the clock (Phaser.Time)
    this.tweens;    //  the tween manager (Phaser.TweenManager)
    this.state;     //  the state manager (Phaser.StateManager)
    this.world;     //  the game world (Phaser.World)
    this.particles; //  the particle manager (Phaser.Particles)
    this.physics;   //  the physics manager (Phaser.Physics)
    this.rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator)

    //  You can use any of these from any function within this State.
    //  But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

    this.border_spr = null;

    this.cats = [4];

    this.selector = null;
};

BasicGame.Game.prototype = {

    create: function () {

        frameBuffer = this.add.bitmapData(400,300);
        frameBuffer.addToWorld(0,0,0,0,2,2);
        frameBuffer.smoothed = false;

        game.world.setBounds(0,0,32000,32000);

        obj_player = new player(16000,16000);

        this.border_spr = game.add.image(0,0,'border');
        this.border_spr.scale.setTo(2,2);
        this.border_spr.bringToTop();

        this.selector = game.add.image(800,0,'selector');

        this.cats[0] = game.add.image(800,0,'cat');
        this.cats[1] = game.add.image(800,120,'cat');
        this.cats[2] = game.add.image(800,240,'cat');
        this.cats[3] = game.add.image(800,360,'cat');

        this.cats[0].bringToTop();
        this.cats[1].bringToTop();
        this.cats[2].bringToTop();
        this.cats[3].bringToTop();

        //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
        console.log("GAME: CREATE");
    },

    update: function () {

        console.log(CAMX+'\n'+CAMY);

        manageCacti();

        obj_player.step();
        obj_player.draw();
        this.selector.y = obj_player.cat*120;
        frameBuffer.clear();

        drawSun();

        var i = entities.length;

        while(i--)
        {
            entities[i].draw();
        }

        //frameBuffer.circle(CAMX,CAMY,4,'#ffffff');
        //frameBuffer.circle(CAMX+lengthdir_x(4,CAMDIR),CAMY+lengthdir_y(4,CAMDIR),2,'#ffffff');

        //frameBuffer.draw('border',0,0);
    },

    quitGame: function (pointer) {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        console.log("GAME: QUIT");
        this.state.start('MainMenu');

    }

};
