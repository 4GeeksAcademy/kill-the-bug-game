import { game } from "./Game";
import { hideActionBoard } from "./scripts";

let HUD = "";

export const MainMenu = {
	create: () => {
		HUD = document.querySelector(".HUD");
		HUD.style.opacity = 1;
		HUD.innerHTML = `
		<span></span>
		<div class="hud-main-menu">
			<a href="#qr" class="popup-link">
				<i class="fa fa-qrcode" aria-hidden="true"></i>
			</a>
		</div>`;

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
	HUD.style.opacity = 0;
	game.state.start("MapSelect");
}