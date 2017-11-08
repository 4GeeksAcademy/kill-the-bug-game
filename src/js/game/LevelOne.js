import { game } from "./Game";
let gameData, layer, player, character;
// Movement vars
const horizontal_speed = 150;
const vertical_speed = -300;
// GROUND
const ground_tile_height = 70;

export const LevelOne = {
	create: () => {
		// Parse Config Data
		gameData = game.cache.getJSON("gameData");
		character = "boy";
		// Background
		game.stage.backgroundColor = "#5D4037";
		let map = game.add.tilemap("level_1");
		map.addTilesetImage("spritesheet", "tiles"); // (name in JSON, name in preloader)
		map.setCollision([104, 153, 133, 105, 152, 81, 129, 145]);
		layer = map.createLayer("Capa de Patrones 1");
		layer.resizeWorld();

		// PLAYER
		player = game.add.sprite(
			70 / 2,
			game.world.height - ground_tile_height / 2 - 486 * 0.25,
			character,
			`idle/000.png`
		);
		player.animations.add(
			"idle",
			Phaser.Animation.generateFrameNames("idle/", 0, 10, ".png", 3),
			13,
			true,
			false
		);
		player.animations.add(
			"dead",
			Phaser.Animation.generateFrameNames("dead/", 0, 10, ".png", 3),
			13,
			false,
			false
		);
		player.animations.add(
			"jump",
			Phaser.Animation.generateFrameNames("jump/", 0, 10, ".png", 3),
			8,
			true,
			false
		);
		player.animations.add(
			"run",
			Phaser.Animation.generateFrameNames("run/", 0, 10, ".png", 3),
			13,
			true,
			false
		);
		player.animations.add(
			"slide",
			Phaser.Animation.generateFrameNames("slide/", 0, 10, ".png", 3),
			13,
			false,
			false
		);
		player.scale.setTo(0.13);
		player.anchor.setTo(0.5);
		// Gravity and Physics
		game.physics.arcade.enable(player);
		game.physics.arcade.gravity.y = 500;
		player.body.collideWorldBounds = true;
		// Camera
		game.camera.follow(player);

		document.querySelectorAll(".action__button").forEach(function(button) {
			const action = button.dataset.action;
			if (action == "right") {
				button.addEventListener("click", function() {
					player.xDest = player.x + 70 * 1;
				});
			} else if (action == "left") {
				button.addEventListener("click", function() {
					player.xDest = player.x - 70 * 1;
				});
			} else if (action == "jump-right") {
				button.addEventListener("click", function() {
					player.yDest = player.y - 70 * 2;
					player.xDest = player.x + 70 * 2;
					player.body.velocity.y = vertical_speed;
				});
			} else if (action == "jump-left") {
				button.addEventListener("click", function() {
					player.yDest = player.y - 70 * 2;
					player.xDest = player.x - 70 * 2;
					player.body.velocity.y = vertical_speed;
				});
			}
		});
	},
	update: () => {
		// COLLISION
		game.physics.arcade.collide(player, layer);

		if (player.body.velocity.x == 0) {
			player.animations.play("idle");
		}

		function movePlayer() {
			const currentPosX = Math.floor(player.x / 10);
			const destinationX = Math.floor(player.xDest / 10);
			// const currentPosY = Math.floor(player.y / 10);
			// const destinationY = Math.floor(player.yDest / 10);

			if (currentPosX == destinationX) {
				player.body.velocity.x = 0;
				player.x = Math.floor(player.xDest);
			} else if (currentPosX < destinationX) {
				player.scale.setTo(0.13);
				player.body.velocity.x = horizontal_speed;
				player.animations.play("run");
			} else if (currentPosX > destinationX) {
				player.body.velocity.x = -horizontal_speed;
				player.scale.setTo(-0.13, 0.13);
				player.animations.play("run");
			}
		}

		movePlayer();
	},
	render: () => {
		// DEBUG MODE
		game.debug.spriteInfo(player, 32, 32);
	},
};
