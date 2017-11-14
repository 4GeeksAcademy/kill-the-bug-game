import { game } from "./Game";

export function gameOver() {
	game.input.activePointer.capture = true;

	// Restart State Button
	let restartButton = game.add.button(
		game.world.width / 2,
		game.world.height / 2 - 60,
		"restart_button",
		restartGame,
		game,
		0
	);
	restartButton.anchor.set(0.5);
	restartButton.scale.setTo(1.5);
	// Restart State Button Text
	let restartText = game.add.text(0, 0, "Click to Restart", {
		font: "26px Times New Roman",
		fill: "#FFFFFF",
		align: "center",
	});
	restartText.anchor.set(0.5);
	restartButton.addChild(restartText);

	// Back to Menu Button
	let menuButton = game.add.button(
		game.world.width / 2,
		game.world.height / 2,
		"restart_button",
		backToMenu,
		game,
		0
	);
	menuButton.anchor.set(0.5);
	// Back to Menu Button Text
	let menuText = game.add.text(0, 0, "Back to Menu", {
		font: "20px Times New Roman",
		fill: "#FFFFFF",
		align: "center",
	});
	menuText.anchor.set(0.5);
	menuButton.addChild(menuText);

	function restartGame() {
		document.querySelector(".action-list ol").innerHTML = "";
		document.querySelectorAll('button').forEach(function (button) {
			button.removeAttribute('disabled');
		});
		game.world.removeAll();
		game.state.start(game.state.current);
	}

	function backToMenu() {
		document.querySelector(".action-list ol").innerHTML = "";
		document.querySelectorAll('button').forEach(function (button) {
			button.removeAttribute('disabled');
		});
		game.world.removeAll();
		game.state.start("MainMenu");
	}
}
