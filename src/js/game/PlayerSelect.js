import { game } from "./Game";
import { mapId, chosenMap } from "./MapSelect";
import { showActionBoard, hideActionBoard, checkIfAvatarAvailable } from "./scripts";
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
		document.querySelector(".return-maps").addEventListener("click", function () {
			document.querySelector(".player-select").style.display = "none";
			game.state.start("MapSelect");
		});

		game.stage.backgroundColor = "#03A9F4";
		document.querySelector(".player-select").style.display = "block";

		let playerListDOM = document.querySelector(".player-select__list");
		playerListDOM.innerHTML = `
		<li class="player-select__list__item item not_found">
			<h3 class="loading">Loading...</h3>
		</li>`;

		Promise
			.resolve(getAttempts(mapId))
			.then(playersObj => {
				playerListDOM.innerHTML = "";
				if (Object.keys(playersObj).length > 0) {
					for (const key in playersObj) {
						let player = playersObj[key];
						let date = new Date(player.created_at);
						playerListDOM.innerHTML += `
					<li class="player-select__list__item item" data-character="${checkIfAvatarAvailable(player.character)}" data-id="${player.id}" data-moves="${player.commands}">
						<span class="item__character" >
							<img src="assets/players/${checkIfAvatarAvailable(player.character)}.png">
						</span>
						<span class="item__username">${player.username}</span>
						<div class="item__play-data play-data">
							<span class="play-data__timestamp">${date.toDateString()}</span>
							<span class="play-data__timestamp">${date.toLocaleTimeString()}</span>
						</div >
						<span class="item__has-moves">
						${player.commands.length > 0 ? "<span class='has'>Has " + player.commands.length + " command(s)</span>" : "<span class='none'>No commands</span>"}
						</span>
					</li > `;
					}

					document.querySelectorAll(".player-select__list__item").forEach(item => {
						item.addEventListener("click", function () {
							character = checkIfAvatarAvailable(this.dataset.character);
							playerId = this.dataset.id;
							moves = (this.dataset.moves).split(",");
							if (moves.length == 0 || moves[0] == "undefined") {
								moves.pop();
								showActionBoard();
							}
							startGame();
						});
					});
				} else {
					playerListDOM.innerHTML = `
					<li class="player-select__list__item item not_found">
						<h2 class="loading">No players found</h2>
					</li > `;
				}
			})
			.catch((error) => swal({
				text: `${error}`,
				icon: "error",
			}));
	},
};

document.querySelector("button[type=\"submit\"]").addEventListener("click", (e) => {
	e.preventDefault();
	let username = document.querySelector(".player-register__username").value;
	let avatar = document.querySelector("input[type=\"radio\"]:checked").value;
	if (username.length > 5) {
		Promise
			.resolve(addAttempt(username, avatar, mapId))
			.then(() => {
				game.state.start("PlayerSelect");
				location.replace("./#");
			});
	} else {
		swal({
			text: "Username should have 5 characters or more",
			icon: "error",
		});
	}

});

function startGame() {
	document.querySelector(".player-select").style.display = "none";
	game.state.start(chosenMap, Phaser.Plugin.StateTransition.Out.ScaleUp);
}