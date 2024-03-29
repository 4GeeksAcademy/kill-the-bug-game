import { game } from "./Game";

let text;

export const Preloader = {
	preload: () => {
		game.world.width = 840;
		game.world.height = 700;
		// Preloader bar
		game.preloadBar = game.add.sprite(game.world.centerX, game.world.centerY, "preloadBar");
		game.preloadBar.anchor.setTo(0.5);
		game.time.advancedTiming = true;
		game.load.setPreloadSprite(game.preloadBar);

		// Not game related images
		game.load.image("cover", "assets/img/game_cover.jpg");

		// GAME ASSETS
		// UI Sprites
		game.load.spritesheet(
			"start_button", "assets/ui/green_spritesheet.png",
			190, 49
		);
		game.load.spritesheet(
			"restart_button", "assets/ui/red_spritesheet.png",
			190, 45
		);
		// Tilesets
		game.load.image("tiles", "assets/tiles/spritesheet.png");
		game.load.tilemap(
			"level_1", "assets/maps/level_1_tilemap.json",
			null, Phaser.Tilemap.TILED_JSON
		);
		game.load.tilemap(
			"level_2", "assets/maps/level_2_tilemap.json",
			null, Phaser.Tilemap.TILED_JSON
		);
		game.load.tilemap(
			"level_3", "assets/maps/level_3_tilemap.json",
			null, Phaser.Tilemap.TILED_JSON
		);
		// Objects
		game.load.spritesheet(
			"objects", "assets/tiles/spritesheet.png",
			70, 70, 155, 0, 2);
		// Spritesheets and JSONs
		game.load.atlasJSONHash("batman", "assets/players/batman/batman_sprite.png", "assets/players/batman/batman.json");
		game.load.atlasJSONHash("vader", "assets/players/vader/vader_sprite.png", "assets/players/vader/vader.json");
		game.load.atlasJSONHash("bug", "assets/enemy/bug/bug_sprite.png", "assets/enemy/bug/bug.json");

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
	loadUpdate: () => { },
	create: () => {
		game.state.start("MainMenu");
	},
};

function loading(progress) {
	text.setText(
		"Loading... " + progress + "%"
	);
}
