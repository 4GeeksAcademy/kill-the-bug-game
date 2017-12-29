import { game } from "./Game";
import { config } from "./Preloader";

export let chosenMap = '';

export const MapSelect = {
	create: () => {
		game.stage.backgroundColor = "#03A9F4";
		document.querySelector('.map-select').style.display = 'block';

		let mapListDOM = document.querySelector('.map-select__list');
		mapListDOM.innerHTML = "";

		for (const key in config.levels) {
			if (config.levels.hasOwnProperty(key)) {
				const mapName = config.levels[key].name;
				const fileName = config.levels[key].map;
				const fileFormat = config.levels[key].thumbnailFormat;

				mapListDOM.innerHTML += `
					<figure>
						<a href="assets/maps/${fileName}.${fileFormat}" data-lightbox="${fileName}" data-title="${mapName}">
							<img src="assets/maps/${fileName}.${fileFormat}">
						</a>
						<figcaption>${mapName}</figcaption>
						<button data-map="${key}">Play</button>
					</figure>
				`;
			}
		}

		document.querySelectorAll('.map-select__list button').forEach(item => {
			item.addEventListener('click', function () {
				chosenMap = this.dataset.map;
				document.querySelector('.map-select').style.display = 'none';
				selectPlayer();
			});
		});
	},
};

function selectPlayer() {
	game.state.start("PlayerSelect", Phaser.Plugin.StateTransition.Out.SlideRight);
}