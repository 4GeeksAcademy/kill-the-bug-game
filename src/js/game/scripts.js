import { game } from "./Game";

export let boardIsHidden = true;

export function gofull() {
	if (game.scale.isFullScreen) {
		game.scale.stopFullScreen();
	}
	else {
		game.scale.startFullScreen(false);
	}
}

export function enableButtons() {
	document.querySelectorAll("button").forEach(function (button) {
		button.removeAttribute("disabled");
	});
}

export function disableButtons() {
	document.querySelectorAll("button").forEach(function (button) {
		button.setAttribute("disabled", true);
	});
}

export function hideActionBoard() {
	boardIsHidden = true;
	document.querySelector(".action-board").style.visibility = "hidden";
	document.querySelector(".action-board").style.display = "none";
	document.querySelector(".action-selection").style.visibility = "hidden";
	document.querySelector(".action-selection").style.display = "none";
	document.querySelector(".command-queue").style.visibility = "hidden";
	document.querySelector(".command-queue").style.display = "none";
}

export function showActionBoard() {
	boardIsHidden = false;
	document.querySelector(".action-board").style.visibility = "visible";
	document.querySelector(".action-board").style.display = "flex";
	document.querySelector(".action-selection").style.visibility = "visible";
	document.querySelector(".action-selection").style.display = "flex";
	document.querySelector(".command-queue").style.visibility = "visible";
	document.querySelector(".command-queue").style.display = "flex";
}

export function checkIfAvatarAvailable(character) {
	switch (character) {
	case "batman":
	case "vader":
		return character;
	default:
		return "batman";
	}
}