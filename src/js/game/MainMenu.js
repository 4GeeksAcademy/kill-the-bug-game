import { game } from "./Game";
import { hideActionBoard } from "./scripts";

export const MainMenu = {
	create: () => {
		game.world.width = 840;
		game.world.height = 700;
		hideActionBoard();

		game.stage.backgroundColor = "#2980b9";
		let geeksLogo = game.add.image(
			game.camera.width / 4,
			game.camera.height - 100,
			"4geeks_logo"
		);
		geeksLogo.scale.setTo(0.5);
		geeksLogo.anchor.set(0.5);
		geeksLogo.fixedToCamera = true;
		let mantenLogo = game.add.image(
			game.camera.width / 4 + game.camera.width / 2,
			game.camera.height - 100,
			"manten_logo"
		);
		mantenLogo.scale.setTo(0.5);
		mantenLogo.anchor.set(0.5);
		mantenLogo.fixedToCamera = true;
		let button = game.add.button(
			game.camera.width / 2,
			game.camera.height / 2,
			"start_button", selectMap, this,
			0, 1, 1
		);
		button.anchor.set(0.5);
		button.fixedToCamera = true;
		let text = game.add.text(0, 0, "START", {
			font: "24px Space Mono",
			fill: "#FFFFFF",
			align: "center",
		});
		text.anchor.set(0.5);
		button.addChild(text);
		game.input.activePointer.capture = true;
	},
};


function selectMap() {
	game.state.start("MapSelect", Phaser.Plugin.StateTransition.Out.SlideRight);
}