"use strict";
BasicGame.Game = function (game) {

    this.border_spr = null;

    this.cats = [4];

    this.selector = null;
    this.frameCam = null;
    this.alphaMask = null;
};

BasicGame.Game.prototype = {

    create: function () {

        frameBuffer = this.add.bitmapData(400,300);
        this.frameCam = frameBuffer.addToWorld(0,0,0,0,2,2);
        frameBuffer.smoothed = false;

        game.world.setBounds(0,0,32000,32000);

        this.alphaMask = game.make.image(0,0,'alphaMask');
        this.alphaMask.scale.setTo(100,100);
        this.alphaMask.alpha = 0.34;

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

        manageCacti();
        manageTanks();

        obj_player.step();
        obj_player.draw();
        
        this.selector.y = obj_player.cat*120;

        if (SCREEN_SHAKE>32)
            SCREEN_SHAKE = 32;

        this.frameCam.x = Math.random()*SCREEN_SHAKE; - SCREEN_SHAKE/2;
        this.frameCam.y = Math.random()*SCREEN_SHAKE; - SCREEN_SHAKE/2;

        if (SCREEN_SHAKE>0)
            SCREEN_SHAKE--;

        //frameBuffer.clear();
        frameBuffer.draw(this.alphaMask);
        drawSun();

        var i = entities.length;
        while(i--)
        {
            entities[i].step();
            entities[i].update();
            if (entities[i].alive === false)
            {   
                if (entities[i] instanceof tank)
                    tanks--;
                entityDestroy(i);
            }
        }

        entities.sort( function(a,b){ return (a.dist - b.dist)} );
        i = entities.length;
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
