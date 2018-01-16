import { game } from "./Game";
import { hideActionBoard } from "./scripts";

export const MainMenu = {
	create: () => {
		game.world.width = 840;
		game.world.height = 700;
		location.replace("./#");
		hideActionBoard();

		let background = game.add.image(0, 0, "cover");
		background.width = 840;
		background.height = 700;

		let button = game.add.button(
			game.camera.width / 2,
			game.camera.height / 2 + 245,
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
	game.state.start("MapSelect");
}