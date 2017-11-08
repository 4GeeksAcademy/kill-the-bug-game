import { game } from "./Game";

export const Boot = {
	init: () => {
		game.input.maxPointers = 1;
		game.stage.disableVisibilityChange = true;
	},
	preload: () => {
		game.load.image("preloadBar", "assets/tiles/preloadBar.png");
	},
	create: () => {
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.state.start("Preloader");
	},
};
