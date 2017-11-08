import { game } from "./Game";

export const MainMenu = {
	create: () => {
		let text = game.add.text(
			game.world.width / 2,
			game.world.height / 2,
			"Click anywhere to start",
			{
				font: "24px Space Mono",
				fill: "#FFFFFF",
				align: "center",
			}
		);
		text.anchor.set(0.5);
		game.input.activePointer.capture = true;
	},
	update: () => {
		if (game.input.activePointer.isDown) {
			game.state.start("LevelOne");
		}
	},
};
