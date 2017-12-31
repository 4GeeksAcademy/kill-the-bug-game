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
	document.querySelector('.action-board').style.display = 'none';
	document.querySelector('.action-selection').style.visibility = 'hidden';
	document.querySelector('.action-selection').style.display = 'none';
	document.querySelector('.action-list').style.visibility = 'hidden';
	document.querySelector('.action-list').style.display = 'none';
}

export function showActionBoard() {
	document.querySelector('.action-board').style.visibility = 'visible';
	document.querySelector('.action-board').style.display = 'flex';
	document.querySelector('.action-selection').style.visibility = 'visible';
	document.querySelector('.action-selection').style.display = 'flex';
	document.querySelector('.action-list').style.visibility = 'visible';
	document.querySelector('.action-list').style.display = 'flex';
}