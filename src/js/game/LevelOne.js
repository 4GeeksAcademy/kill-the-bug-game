import { game } from "./Game";
import { gameOver } from "./gameOver";
import { gofull, enableButtons, disableButtons } from "./scripts";

// Global vars
let gameData,
	worldLayer,
	endGameLayer,
	laderLayer,
	onLader,
	player,
	playerAlive,
	playerIsMoving,
	playEndCheck,
	character;
let levelCompleted = false;
// Movement vars
let actionsArray = [];
const horizontal_speed = 150;
const vertical_speed = -280;
let lastPosY;

/*
	Create event listener for each action button.
	Every button press stores last Y postion
	and sets X destination
*/
const actionList = document.querySelector(".action-list ol");
document.querySelectorAll(".action__button").forEach(function (button) {
	const actionData = button.dataset.action;
	actionsArray = [];
	button.addEventListener("click", function () {
		if (["runRight", "runLeft", "jumpRight", "jumpLeft", "climb"].includes(actionData) && playerAlive) {
			actionsArray.push(actionData);
			actionList.innerHTML += `<li class="action-list__item action-list__item--${actionData}"></li>`;
		} else {
			if (actionsArray.length > 0) {
				disableButtons();
				play();
			}
		}
	});
});

document.querySelector('.action-list__header button').addEventListener('click', clearActionsList);

clearActionsList();

/* ==================================
		LEVEL ONE !!!
===================================*/
export const LevelOne = {
	create: () => {
		// game.input.onDown.add(gofull, game);
		enableButtons();
		playerAlive = true;

		// Parse Config Data
		gameData = game.cache.getJSON("gameData");
		character = "boy";
		// Background
		game.stage.backgroundColor = "#5D4037";
		let map = game.add.tilemap("level_1");
		map.addTilesetImage("spritesheet", "tiles"); // (name in JSON, name in preloader)
		worldLayer = map.createLayer("World Map Layer");
		endGameLayer = map.createLayer("Exit Layer");
		laderLayer = map.createLayer("Lader Layer");
		map.setCollision(
			[104, 153, 133, 105, 152, 81, 129, 145],
			true,
			"World Map Layer"
		);
		map.setCollision(65, false, "Exit Layer");
		map.setCollision([20, 32], false, "Lader Layer");
		worldLayer.resizeWorld();
		// Check collision for end game
		map.setTileIndexCallback(
			65,
			() => { levelCompleted = true; player.frame = 7; },
			game,
			endGameLayer
		);

		// Check lader overlap
		map.setTileIndexCallback(
			[20, 32],
			() => { onLader = true; },
			game,
			laderLayer
		);

		// PLAYER
		player = game.add.sprite(70 / 2, 598.4, "character");
		player.frame = 23;
		player.animations.add("walk", [9, 10], 8, true);
		player.animations.add("jump", [1], 4);
		player.animations.add("dead", [4], 4);
		player.animations.add("slide", [19], 4);
		player.animations.add("climb", [5, 6], 3, true);
		game.add.existing(player);
		lastPosY = Math.floor(player.y / 10);

		// Player scales and center anchor
		player.scale.setTo(0.6);
		player.anchor.setTo(0.5);
		// Gravity and Physics
		game.physics.arcade.enable(player);
		game.physics.arcade.gravity.y = 500;
		player.body.collideWorldBounds = true;

		// Camera
		game.camera.follow(player);
	},
	update: () => {
		// COLLISION
		game.physics.arcade.collide(player, worldLayer);
		game.physics.arcade.collide(player, endGameLayer);
		// player dies if falls 3 floors
		if (Math.abs(lastPosY - Math.floor(player.y / 10)) >= 21) {
			playerAlive = false;
		}
		// Continue game if player is not dead
		if (!playerAlive) {
			player.animations.play("dead");
			clearInterval(playEndCheck);
			gameOver();
		}
		// If player is on Lader, climb action is possible
		if (game.physics.arcade.collide(player, laderLayer)) {
			onLader = true;
		} else {
			onLader = false;
		}

		/*
			Animation play conditions
			if player is alive
		*/
		if (playerAlive) {
			if (player.body.velocity.x == 0 && player.body.blocked.down) {
				// Idle if x velocity is 0 and on floor
				player.frame = 23;
			} else if (player.body.velocity.x != 0 && player.body.blocked.down) {
				// Run if x velocity is NOT 0 and on floor
				player.animations.play("walk");
			} else if (
				player.body.velocity.y != 0 &&
				player.body.velocity.x == 0 &&
				!player.body.blocked.down &&
				game.physics.arcade.gravity.y > 0
			) {
				/*
					Jump if y velocity is NOT 0 and not on floor
					And if there is no gravity
				*/
				player.animations.play("jump");
			}
			// Constatly check for movement
			movePlayer();
		}
	},
	render: () => {
		// Uncomment to show DEBUG MODE on Player
		// game.debug.spriteInfo(player, 32, 32);
		// game.debug.bodyInfo(player, 32, 120);
	},
};

/*
	Check player current position and destination
	and move it accordingly
*/
function movePlayer() {
	game.physics.arcade.collide(player, laderLayer);
	const currentPosX = Math.floor(player.x / 10);
	const destinationX = Math.floor(player.xDest / 10);
	// Set flag to false if player has no velocity
	if (player.body.velocity.x == 0 && player.body.velocity.y == 0) {
		playerIsMoving = false;
	}
	// Move player until it reaches point X destination
	if (currentPosX == destinationX) {
		player.body.velocity.x = 0;
		player.x = Math.floor(player.xDest);
	} else if (currentPosX < destinationX) {
		playerIsMoving = true;
		player.scale.setTo(0.6);
		player.body.velocity.x = horizontal_speed;
		/*
			Check if right side is blocked
			If so, return to last position
		*/
		if (
			player.body.blocked.right &&
			player.body.blocked.down &&
			!player.body.blocked.up
		) {
			player.x = player.x - 10;
			player.xDest = player.x;
		}
	} else if (currentPosX > destinationX) {
		playerIsMoving = true;
		player.body.velocity.x = -horizontal_speed;
		player.scale.setTo(-0.6, 0.6);
		/*
			Check if left side is blocked
			If so, return to last position
		*/
		if (
			player.body.blocked.left &&
			player.body.blocked.down &&
			!player.body.blocked.up
		) {
			playerIsMoving = false;
			player.x = player.x + 10;
			player.xDest = player.x;
		}
		if (player.body.velocity.x < 0) {
			playerIsMoving = true;
		}
	}
}

function endLevel() {
	setTimeout(() => {
		clearInterval(playEndCheck);
		clearActionsList();
		disableButtons();
		game.state.start("MainMenu");
	}, 1000);
}

function runRight() {
	lastPosY = Math.floor(player.y / 10);
	player.xDest = player.x + 70 * 12;
}

function runLeft() {
	lastPosY = Math.floor(player.y / 10);
	player.xDest = player.x - 70 * 12;
}

function jumpRight() {
	lastPosY = Math.floor(player.y / 10);
	player.yDest = player.y - 70 * 2;
	player.xDest = player.x + 70 * 2;
	player.body.velocity.y = vertical_speed;
}

function jumpLeft() {
	lastPosY = Math.floor(player.y / 10);
	player.yDest = player.y - 70 * 2;
	player.xDest = player.x - 70 * 2;
	player.body.velocity.y = vertical_speed;
}

function climb() {
	if (onLader) {
		playerIsMoving = true;
		player.animations.play("climb");
		game.physics.arcade.gravity.y = 0;
		player.yDest = player.y - 70 * 1;
		player.body.velocity.y = vertical_speed * 0.2;
		setTimeout(function () {
			onLader = false;
			player.scale.setTo(0.6);
			player.body.velocity.x = horizontal_speed;
			player.xDest = player.x + 70;
			game.physics.arcade.gravity.y = 500;
		}, 2500);
	}
}

function play() {
	playEndCheck = setInterval(() => {
		if (!playerIsMoving && !levelCompleted && actionsArray.length == 0) {
			playerAlive = false;
			clearInterval(playEndCheck);
			clearActionsList();
		} else if (!playerIsMoving && levelCompleted) {
			endLevel();
		}
	}, 1000);

	if (actionsArray.length != 0) {
		if (!playerIsMoving) {
			eval(actionsArray[0] + "()");
			actionsArray.shift();
		}
		setTimeout(() => {
			clearInterval(playEndCheck);
			play();
		}, 500);
	}
}

function clearActionsList() {
	actionList.innerHTML = "";
	actionsArray = [];
}