import { game } from "./Game";
import { gameOver } from "./gameOver";

// Global vars
let gameData,
	worldLayer,
	endGameLayer,
	laderLayer,
	onLader,
	player,
	playerAlive,
	character;
// Movement vars
const horizontal_speed = 150;
const vertical_speed = -280;
let lastPosY;

export const LevelOne = {
	create: () => {
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
		map.setTileIndexCallback(65, endLevel, game, endGameLayer);

		// Check lader overlap
		map.setTileIndexCallback(
			[20, 32],
			() => (onLader = true),
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

		/*
			Create event listener for each action button.
			Every button press stores last Y postion
			and sets X destination
		*/
		document.querySelectorAll(".action__button").forEach(function(button) {
			const action = button.dataset.action;
			if (action == "right") {
				button.addEventListener("click", function() {
					lastPosY = Math.floor(player.y / 10);
					player.xDest = player.x + 70 * 12;
				});
			} else if (action == "left") {
				button.addEventListener("click", function() {
					lastPosY = Math.floor(player.y / 10);
					player.xDest = player.x - 70 * 12;
				});
			} else if (action == "jump-right") {
				button.addEventListener("click", function() {
					lastPosY = Math.floor(player.y / 10);
					player.yDest = player.y - 70 * 2;
					player.xDest = player.x + 70 * 2;
					player.body.velocity.y = vertical_speed;
				});
			} else if (action == "jump-left") {
				button.addEventListener("click", function() {
					lastPosY = Math.floor(player.y / 10);
					player.yDest = player.y - 70 * 2;
					player.xDest = player.x - 70 * 2;
					player.body.velocity.y = vertical_speed;
				});
			} else if (action == "climb") {
				button.addEventListener("click", function() {
					if (onLader) {
						player.animations.play("climb");
						game.physics.arcade.gravity.y = 0;
						player.yDest = player.y - 70 * 1;
						player.body.velocity.y = vertical_speed * 0.2;
						setTimeout(function() {
							onLader = false;
							player.scale.setTo(0.6);
							player.body.velocity.x = horizontal_speed;
							player.xDest = player.x + 70;
							game.physics.arcade.gravity.y = 500;
						}, 2500);
					}
				});
			}
		});
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
		// Uncomment for DEBUG MODE on Player
		game.debug.spriteInfo(player, 32, 32);
		game.debug.bodyInfo(player, 32, 120);
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
	// Move player until it reaches point X destination
	if (currentPosX == destinationX) {
		player.body.velocity.x = 0;
		player.x = Math.floor(player.xDest);
	} else if (currentPosX < destinationX) {
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
			player.x = player.x + 10;
			player.xDest = player.x;
		}
	}
}

function endLevel() {
	player.frame = 7;
	setTimeout(() => {
		game.state.start("MainMenu");
	}, 1000);
}
