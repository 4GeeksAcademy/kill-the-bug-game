import { game } from './Game';

export function gofull() {
	if (game.scale.isFullScreen) {
		game.scale.stopFullScreen();
	}
	else {
		game.scale.startFullScreen(false);
	}
}

export function enableButtons() {
	document.querySelectorAll('button').forEach(function (button) {
		button.removeAttribute('disabled');
	});
}

export function disableButtons() {
	document.querySelectorAll('button').forEach(function (button) {
		button.setAttribute('disabled', true);
	});
}

export function hideActionBoard() {
	document.querySelector('.action-board').style.visibility = 'hidden';
}

export function showActionBoard() {
	document.querySelector('.action-board').style.visibility = 'visible';
}