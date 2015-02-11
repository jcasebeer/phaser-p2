"use strict";
var BasicGame = {};

BasicGame.Boot = function (game) {

};

BasicGame.Boot.prototype = {

    init: function () {

        //  Unless you specifically know your game needs to support multi-touch I would recommend setting this to 1
        this.input.maxPointers = 1;

        //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
        this.stage.disableVisibilityChange = true;

        if (this.game.device.desktop)
        {
            //  If you have any desktop specific settings, they can go in here
            this.scale.pageAlignHorizontally = true;
        }
        else
        {
            //  Same goes for mobile settings.
            //  In this case we're saying "scale the game, no lower than 480x260 and no higher than 1024x768"
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.setMinMax(400, 300, 800, 600);
            this.scale.forceLandscape = true;
            this.scale.pageAlignHorizontally = true;
        }

    },

    preload: function () {

        //  Here we load the assets required for our preloader (in this case a background and a loading bar)
        this.load.image('preloaderBackground', 'assets/preloader_background.png');
        this.load.image('preloaderBar', 'assets/preloader_bar.png');
        console.log("BOOT: PRELOAD");

    },

    create: function () {

        //  By this point the preloader assets have loaded to the cache, we've set the game settings
        //  So now let's start the real preloader going

        // add our games keys

        leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    game.input.keyboard.addKeyCapture(Phaser.Keyboard.LEFT);

    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    game.input.keyboard.addKeyCapture(Phaser.Keyboard.RIGHT);

    upKey= game.input.keyboard.addKey(Phaser.Keyboard.UP);
    game.input.keyboard.addKeyCapture(Phaser.Keyboard.UP);

    downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    game.input.keyboard.addKeyCapture(Phaser.Keyboard.DOWN);

    shootKey = game.input.keyboard.addKey(Phaser.Keyboard.X);
    game.input.keyboard.addKeyCapture(Phaser.Keyboard.X);

    swapKey = game.input.keyboard.addKey(Phaser.Keyboard.Z);
    game.input.keyboard.addKeyCapture(Phaser.Keyboard.Z);

        this.state.start('Preloader');
        console.log("BOOT: CREATE");

    }

};
