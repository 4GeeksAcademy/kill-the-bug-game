import { game } from "./Game";
// import { playersArr } from "../lib/firebase";
let text;

export const Preloader = {
	preload: () => {
		// Preloader bar
		game.preloadBar = game.add.sprite(
			game.world.centerX,
			game.world.centerY,
			"preloadBar"
		);
		game.preloadBar.anchor.setTo(0.5);
		game.time.advancedTiming = true;
		game.load.setPreloadSprite(game.preloadBar);
		// Data
		game.load.json("gameData", "config/game.json");
		// Not game related images
		game.load.image("4geeks_logo", "assets/img/4geeks_logo.png");
		game.load.image("manten_logo", "assets/img/manten_logo.png");

		// GAME ASSETS
		// UI Sprites
		game.load.spritesheet(
			"start_button",
			"assets/ui/green_spritesheet.png",
			190,
			49
		);
		game.load.spritesheet(
			"restart_button",
			"assets/ui/red_spritesheet.png",
			190,
			45
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

		// Loading text
		text = game.add.text(0, 0, "Loading " + game.load.progress, {
			font: "24px Space Mono",
			fill: "#FFFFFF",
			align: "center",
		});
		text.anchor.setTo(0.5, 0.5);
		game.preloadBar.addChild(text);
		game.load.onFileComplete.add(loading, this);
	},
	update: () => {
		// console.log(game.load);
	},
	loadUpdate: () => { },
	create: () => {
		game.state.start("MainMenu");
	},
};

function loading(progress, cacheKey, success, totalLoaded, totalFiles) {
	text.setText(
		"Loading: " + progress + "% - " + totalLoaded + " out of " + totalFiles
	);
}
