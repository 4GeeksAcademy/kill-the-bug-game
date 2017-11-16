import { game } from "./Game";
import { writePlayerData } from "../lib/firebase";
import { playersArr } from './Preloader';

export let character = '';
export let playerUsername = '';

export const PlayerSelect = {
	create: () => {
		game.stage.backgroundColor = "#03A9F4";
		document.querySelector('.player-select').style.display = 'block';

		let playerListDOM = document.querySelector('.player-select__list');
		playerListDOM.innerHTML = `
			<li class="player-select__list__item item"">Loading...</li>`;

		setTimeout(() => {
			playerListDOM.innerHTML = "";
			playersArr.forEach((player) => {
				let date = new Date(player.created_at);
				playerListDOM.innerHTML += `
				<li class="player-select__list__item item" data-character="${player.character}" data-username="${player.username}">
					<span class="item__character" >
						<img src="assets/players/${player.character}.png">
					</span>
					<span class="item__username">${player.username}</span>
					<div class="item__play-data play-data">
						<span class="play-data__timestamp">${date.toDateString()} - ${date.toLocaleTimeString()}</span>
						<span class="play-data__level">Level: ${parseInt(player.current_level) + 1}</span>
					</div >
				</li > `;
			});

			document.querySelectorAll('.player-select__list__item').forEach(item => {
				item.addEventListener('click', function () {
					character = this.dataset.character;
					playerUsername = this.dataset.username;
					startGame();
				});
			});
		}, 1000);

		document.querySelector('button[type="submit"]').addEventListener('click', (e) => {
			e.preventDefault();
			let username = document.querySelector('.player-register__username').value;
			let avatar = document.querySelector('input[type="radio"]:checked').value;
			writePlayerData(username, avatar);
			window.location.href = "/";
		});
	},
};

function startGame() {
	document.querySelector('.player-select').style.display = 'none';
	game.state.start("LevelOne", Phaser.Plugin.StateTransition.Out.ScaleUp);
}