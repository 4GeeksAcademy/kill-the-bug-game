import { game } from "./Game";
let gameData, layer, player, character;
// Movement vars
const horizontal_speed = 150;
// const vertical_speed = -350;
// GROUND
const ground_tile_height = 128;

export const LevelOne = {
	create: () => {
		// Parse Config Data
		gameData = game.cache.getJSON("gameData");
		character = "boy";
		// Background
		let map = game.add.tilemap("level_1");
		map.addTilesetImage("tiles2", "tiles");
		map.setCollision([12, 4, 8]);
		layer = map.createLayer("Tile Layer 1");
		layer.resizeWorld();

		// PLAYER
		player = game.add.sprite(
			128 / 2,
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
		player.scale.setTo(0.25);
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
					player.xDest = player.x + 128 * 1;
				});
			} else if (action == "left") {
				button.addEventListener("click", function() {
					player.xDest = player.x - 128 * 1;
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
			// console.log(Math.floor(player.x) < Math.floor(player.xDest));
			if (Math.floor(player.x) == Math.floor(player.xDest)) {
				player.body.velocity.x = 0;
			} else if (Math.floor(player.x) < Math.floor(player.xDest)) {
				player.body.velocity.x = horizontal_speed;
				player.animations.play("run");
				player.scale.setTo(0.25);
			} else if (Math.floor(player.x) > Math.floor(player.xDest)) {
				player.body.velocity.x = -horizontal_speed;
				player.scale.setTo(-0.25, 0.25);
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
