import { game } from "./Game";
import { chosenMap } from "./MapSelect";
import { showActionBoard, hideActionBoard } from "./scripts";
import { getAttempts, addAttempt } from "../lib/Api";
import swal from "sweetalert";

export let character = "";
export let playerId = "";
export let moves = "";

export const PlayerSelect = {
	create: () => {
		game.world.width = 840;
		game.world.height = 700;
		hideActionBoard();
		document.querySelector(".reload-player").addEventListener("click", function () {
			game.state.start("PlayerSelect");
		});

		game.stage.backgroundColor = "#03A9F4";
		document.querySelector(".player-select").style.display = "block";

		let playerListDOM = document.querySelector(".player-select__list");
		playerListDOM.innerHTML = `
		<li class="player-select__list__item item not_found">
			<h3 class="loading">Loading...</h3>
		</li>`;

		Promise.resolve(getAttempts()).then(playersArr => {
			playerListDOM.innerHTML = "";
			if (playersArr.length > 0) {
				playersArr.forEach((player) => {
					let date = new Date(player.created_at);
					playerListDOM.innerHTML += `
					<li class="player-select__list__item item" data-character="${player.character}" data-id="${player.id}" data-moves="${player.commands}">
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

			document.querySelectorAll(".player-select__list__item").forEach(item => {
				item.addEventListener("click", function () {
					character = this.dataset.character;
					playerId = this.dataset.id;
					moves = (this.dataset.moves).split(",");
					if (moves.length == 0 || moves[0] == "undefined") {
						moves.pop();
						showActionBoard();
					}

					startGame();
				});
			});
		}).catch(err => swal({
			text: "Please, select actions first.",
			icon: "error",
		}));

		document.querySelector("button[type=\"submit\"]").addEventListener("click", (e) => {
			e.preventDefault();
			let username = document.querySelector(".player-register__username").value;
			let avatar = document.querySelector("input[type=\"radio\"]:checked").value;
			addAttempt(username, avatar);
			location.replace("/");
		});
	},
};

function startGame() {
	document.querySelector(".player-select").style.display = "none";
	game.state.start(chosenMap, Phaser.Plugin.StateTransition.Out.ScaleUp);
}