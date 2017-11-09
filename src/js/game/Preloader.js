import { game } from "./Game";
// import { playersArr } from "../lib/firebase";
let text;

export const Preloader = {
	preload: () => {
		game.preloadBar = game.add.sprite(
			game.world.centerX,
			game.world.centerY,
			"preloadBar"
		);
		game.preloadBar.anchor.setTo(0.5);
		game.time.advancedTiming = true;
		game.load.setPreloadSprite(game.preloadBar);
		text = game.add.text(
			game.world.width / 2,
			100,
			"Loading " + game.load.progress,
			{
				font: "24px Space Mono",
				fill: "#FFFFFF",
				align: "center",
			}
		);
		// Game dimensions
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		game.scale.PageAlignHorizontally = true;
		game.scale.PageAlignVertically = true;
		game.stage.backgroundColor = "#424242";
		// LOAD ALL ASSETS OF THE GAME
		// Data
		game.load.json("gameData", "config/game.json");
		// Not game related images
		game.load.image("4geeks_logo", "assets/img/4geeks_logo.png");
		game.load.image("manten_logo", "assets/img/manten_logo.png");
		// UI Sprites
		game.load.spritesheet(
			"start_button",
			"assets/ui/green_spritesheet.png",
			190,
			49
		);
		// Tilesets
		game.load.tilemap(
			"level_1",
			"assets/maps/level_1_tilemap.json",
			null,
			Phaser.Tilemap.TILED_JSON
		);
		game.load.image("tiles", "assets/tiles/spritesheet.png");
		// Character
		game.load.spritesheet(
			"character",
			"assets/players/adventurer_spritesheet.png",
			80,
			110
		);
	},
	update: () => {
		text = "Loading " + game.load.progress;
	},
	create: () => {
		game.state.start("MainMenu");
		// game.state.start("LevelOne");
	},
};
