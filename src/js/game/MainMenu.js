import { game } from "./Game";
import { gofull, disableButtons } from "./scripts";


export const MainMenu = {
	create: () => {
		// game.input.onDown.add(gofull, game);
		disableButtons();
		game.stage.backgroundColor = "#424242";
		let geeksLogo = game.add.image(
			game.world.width / 4,
			game.world.height - 100,
			"4geeks_logo"
		);
		geeksLogo.scale.setTo(0.5);
		geeksLogo.anchor.set(0.5);
		let mantenLogo = game.add.image(
			game.world.width / 4 + game.world.width / 2,
			game.world.height - 100,
			"manten_logo"
		);
		mantenLogo.scale.setTo(0.5);
		mantenLogo.anchor.set(0.5);
		let button = game.add.button(
			game.world.width / 2,
			game.world.height / 2,
			"start_button",
			startGame,
			this,
			0,
			1,
			1
		);
		button.anchor.set(0.5);
		let text = game.add.text(0, 0, "START", {
			font: "24px Space Mono",
			fill: "#FFFFFF",
			align: "center",
		});
		text.anchor.set(0.5);
		button.addChild(text);
		game.input.activePointer.capture = true;

		function startGame() {
			game.state.start("LevelOne", Phaser.Plugin.StateTransition.Out.ScaleUp);
		}
	},
};
