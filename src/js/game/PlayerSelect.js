import { game } from "./Game";
import { writePlayerData } from "../lib/firebase";
import { chosenMap } from './MapSelect';
import { getPlayers } from '../lib/firebase';
import { showActionBoard, hideActionBoard } from "./scripts";

let playersArr = [];
export let character = '';
export let playerTimestampId = '';
export let moves = '';

export const PlayerSelect = {
	create: () => {
		hideActionBoard();
		playersArr = getPlayers();

		document.querySelector('.reload-player').addEventListener('click', function () {
			game.state.start("PlayerSelect");
		});

		game.stage.backgroundColor = "#03A9F4";
		document.querySelector('.player-select').style.display = 'block';

		let playerListDOM = document.querySelector('.player-select__list');
		playerListDOM.innerHTML = `<li class="player-select__list__item item not_found"><h3>Loading...</h3></li>`;
		setTimeout(() => {
			playerListDOM.innerHTML = "";
			if (playersArr.length > 0) {
				playersArr.forEach((player) => {
					let date = new Date(player.created_at);
					playerListDOM.innerHTML += `
					<li class="player-select__list__item item" data-character="${player.character}" data-timestamp="${player.created_at}" data-moves="${player.moves}">
						<span class="item__character" >
							<img src="assets/players/${player.character}.png">
						</span>
						<span class="item__username">${player.username}</span>
						<div class="item__play-data play-data">
							<span class="play-data__timestamp">${date.toDateString()}</span>
							<span class="play-data__timestamp">${date.toLocaleTimeString()}</span>
						</div >
					</li > `;
				});
			} else {
				playerListDOM.innerHTML = `
				<li class="player-select__list__item item not_found">
					<h2>No players found</h2>
				</li > `;
			}

			document.querySelectorAll('.player-select__list__item').forEach(item => {
				item.addEventListener('click', function () {
					character = this.dataset.character;
					playerTimestampId = parseInt(this.dataset.timestamp);
					moves = (this.dataset.moves).split(',');
					if (moves.length == 0 || moves[0] == 'undefined') {
						moves.pop();
						showActionBoard();
					}

					startGame();
				});
			});
		}, 2000);

		document.querySelector('button[type="submit"]').addEventListener('click', (e) => {
			e.preventDefault();
			let username = document.querySelector('.player-register__username').value;
			let avatar = document.querySelector('input[type="radio"]:checked').value;
			writePlayerData(username, avatar);
			location.replace('/');
		});
	},
};

function startGame() {
	document.querySelector('.player-select').style.display = 'none';
	game.state.start(chosenMap, Phaser.Plugin.StateTransition.Out.ScaleUp);
}