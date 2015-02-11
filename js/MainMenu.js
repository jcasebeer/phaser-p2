"use strict";
BasicGame.MainMenu = function (game) {

	//this.music = null;
	//this.playButton = null;
	this.border_spr = null;

};

BasicGame.MainMenu.prototype = {

	create: function () {

		//	We've already preloaded our assets, so let's kick right into the Main Menu itself.
		//	Here all we're doing is playing some music and adding a picture and button
		//	Naturally I expect you to do something significantly better :)

		//this.music = this.add.audio('titleMusic');
		//this.music.play();
		this.stage.backgroundColor = '#000000';
		//this.add.sprite(0, 0, 'titlepage');
		this.add.text(400,300,"TANK CATZ\nPRESS X TO START", {
			font: "32px Courier New",
			fill: "#ffffff",
        	align: "center"
		}).anchor.setTo(0.5,0.5);

		this.border_spr = this.add.image(0,0,'border');
		this.border_spr.scale.setTo(2,2);


		//this.playButton = this.add.button(400, 600, 'playButton', this.startGame, this, 'buttonOver', 'buttonOut', 'buttonOver');
		console.log("MAIN MENU: CREATE");
	},

	update: function () {

		//	Do some nice funky main menu effect here
		console.log("MAIN MENU: UPDATE");
		if (shootKey.isDown)
			this.startGame();

	},

	startGame: function (pointer) {

		//	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
		//this.music.stop();

		console.log("MAIN MENU: STARTGAME");
		//	And start the actual game
		this.state.start('Game');

	}

};
