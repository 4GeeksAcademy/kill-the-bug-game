import { game } from "./Game";
import { getAllLevels } from "../lib/Api";

export let chosenMap = "";
export let mapId = "";

export const MapSelect = {
	create: () => {
		game.world.width = 840;
		game.world.height = 700;
		game.stage.backgroundColor = "#03A9F4";
		document.querySelector(".map-select").style.display = "block";

		let mapListDOM = document.querySelector(".map-select__list");
		mapListDOM.innerHTML = `
		<li class="player-select__list__item item not_found">
			<h3 class="loading">Loading...</h3>
		</li>`;

		Promise
			.resolve(getAllLevels())
			.then((levelData) => {
				mapListDOM.innerHTML = "";
				levelData.forEach(level => {
					const difficulty = level.difficulty;
					const mapName = level.title;
					const thumb = level.thumb;
					const id = level.slug;

					mapListDOM.innerHTML += `
						<figure>
							<img src="${thumb}">
							<figcaption>${mapName} - ${difficulty}</figcaption>
							<button data-id="${id}" data-map="${mapName}">Play</button>
						</figure>
					`;
				});


				document.querySelectorAll(".map-select__list button").forEach(item => {
					item.addEventListener("click", function () {
						mapId = this.dataset.id;
						chosenMap = this.dataset.map;
						document.querySelector(".map-select").style.display = "none";
						selectPlayer();
					});
				});
			});
	},
};

function selectPlayer() {
	game.state.start("PlayerSelect", Phaser.Plugin.StateTransition.Out.SlideRight);
}