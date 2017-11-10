import { game } from "./Game";

export const Boot = {
	init: () => {
		game.input.maxPointers = 1;
		game.stage.disableVisibilityChange = true;
		// Game dimensions
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		game.scale.PageAlignHorizontally = true;
		game.scale.PageAlignVertically = true;
		game.stage.backgroundColor = "#424242";
	},
	preload: () => {
		game.load.image("preloadBar", "assets/tiles/preloadBar.png");
	},
	create: () => {
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.state.start("Preloader");
	},
};
