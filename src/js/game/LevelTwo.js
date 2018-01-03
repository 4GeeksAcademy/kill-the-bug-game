import { game } from "./Game";
import { gameOver } from "./GameOver";
import { showActionBoard, disableButtons, enableButtons } from "./scripts";
import { character, moves, playerTimestampId } from "./PlayerSelect";
import { setPlayerPlayed } from "../lib/firebase";

/*
	Create event listener for each action button.
	Every button press stores last Y postion
	and sets X destination
*/
// Global vars
let worldLayer = "",
	endGameLayer = "",
	laderLayer = "",
	invisibleLayer = "",
	boxLayer = "",
	onLader = "",
	heightDiff = "",
	player = "",
	playerAlive = "",
	playerIsMoving = "",
	playEndCheck = "",
	box = "";
let levelCompleted = false;
// Movement vars
const horizontal_speed = 150;
const vertical_speed = -280;
let lastPosY = "";
let button;
let playerPushing = false,
	canPush = false;

let actionsArray = [];

/* ==================================
		LEVEL ONE !!!
===================================*/
export const LevelTwo = {
	create: () => {
		// World
		//----------------------------------------------------------
		levelCompleted = false;
		game.stage.backgroundColor = "#5D4037";
		let map = game.add.tilemap("level_2");
		map.addTilesetImage("spritesheet", "tiles"); // (name in JSON, name in preloader)
		worldLayer = map.createLayer("World Map Layer");
		endGameLayer = map.createLayer("Exit Layer");
		laderLayer = map.createLayer("Lader Layer");
		boxLayer = map.createLayer("Box Layer");
		boxLayer.visible = false;
		invisibleLayer = map.createLayer("Invisible Layer");
		invisibleLayer.visible = false;
		map.setCollision(
			[104, 153, 133, 105, 152, 81, 129, 145],
			true,
			"World Map Layer"
		);
		map.setCollision(65, false, "Exit Layer");
		map.setCollision(145, true, "Box Layer");
		map.setCollision([20, 32], false, "Lader Layer");
		map.setCollision([1, 25], true, "Invisible Layer");
		worldLayer.resizeWorld();
		//----------------------------------------------------------

		// Check lader overlap
		//----------------------------------------------------------
		map.setTileIndexCallback(
			32,
			() => { onLader = true; },
			game,
			laderLayer
		);
		//----------------------------------------------------------

		// Check if reached top of lader
		//----------------------------------------------------------
		map.setTileIndexCallback(
			20,
			() => {
				player.y += 1;
				onLader = false;
				player.scale.setTo(0.6);
				player.body.velocity.x = horizontal_speed;
				player.xDest = player.xDest + 15;
				game.physics.arcade.gravity.y = 500;
			},
			game,
			laderLayer
		);

		// Check collision for end game
		//----------------------------------------------------------
		map.setTileIndexCallback(
			65,
			() => {
				levelCompleted = true;
				player.frame = 7;
			},
			game,
			endGameLayer
		);
		//----------------------------------------------------------

		// Check collision box-wall
		//----------------------------------------------------------
		map.setTileIndexCallback(
			1,
			() => {
				box.kill();
				boxLayer.visible = true;
			},
			game,
			invisibleLayer
		);
		//----------------------------------------------------------

		// PLAYER
		//----------------------------------------------------------
		player = game.add.sprite(70 / 2, 598.4, character);
		player.frame = 23;
		player.animations.add("walk", [9, 10], 8, true);
		player.animations.add("jump", [1], 4);
		player.animations.add("dead", [4], 4);
		player.animations.add("slide", [19], 4);
		player.animations.add("climb", [5, 6], 3, true);
		player.animations.add("push", [12], 3);
		game.add.existing(player);
		lastPosY = Math.floor(player.y / 10);
		//----------------------------------------------------------

		// Box
		//----------------------------------------------------------
		box = game.add.sprite(70 * 3, 560, "objects");
		box.frame = 144;
		//----------------------------------------------------------

		// Player scales and center anchor
		//----------------------------------------------------------
		player.scale.setTo(0.6);
		player.anchor.setTo(0.5);
		//----------------------------------------------------------

		// Gravity and Physics
		//----------------------------------------------------------
		game.physics.arcade.enable([player, box]);
		box.body.immovable = true;
		game.physics.arcade.gravity.y = 500;
		player.body.collideWorldBounds = true;
		box.body.collideWorldBounds = true;
		//----------------------------------------------------------

		// Camera
		//----------------------------------------------------------
		game.camera.follow(player);
		//----------------------------------------------------------

		// ACTIONS - MOVES
		//----------------------------------------------------------
		actionsArray = moves.length > 0 ? [...moves] : [];
		if (actionsArray.length > 0) {
			button = game.add.button(
				game.world.width / 2, game.world.height / 2,
				"start_button", play, this,
				0, 1, 1
			);
			button.anchor.set(0.5);
			let text = game.add.text(0, 0, "START", {
				font: "24px Space Mono",
				fill: "#FFFFFF",
				align: "center",
			});
			text.anchor.set(0.5);
			button.addChild(text);
			game.input.activePointer.capture = true;
			game.world.bringToTop(button);
		} else {
			showActionBoard();
			enableButtons();
		}
		//----------------------------------------------------------

		// Remove event listeners from action buttons
		// ----------------------------------------------------------------
		let actionArea = document.querySelector(".action-selection");
		let actionAreaClone = actionArea.cloneNode(true);
		actionArea.parentNode.replaceChild(actionAreaClone, actionArea);
		// ----------------------------------------------------------------

		// Add event listeners from actions buttons
		// ----------------------------------------------------------------
		document.querySelectorAll(".action__button").forEach(function (button) {
			const actionList = document.querySelector(".action-list ol");
			const actionData = button.dataset.action;

			button.addEventListener("click", function () {
				if (["runRight", "runLeft", "jumpRight", "jumpLeft", "climb", "open", "push"].includes(actionData) && playerAlive) {
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
		// ----------------------------------------------------------------

		document.querySelector(".action-list__header button").addEventListener("click", clearActionsList);

		levelCompleted = false;
		playerAlive = true;
	},
	update: () => {
		// COLLISION
		//----------------------------------------------------------
		game.physics.arcade.collide(box, invisibleLayer);
		game.physics.arcade.collide(player, worldLayer);
		game.physics.arcade.collide(player, boxLayer);
		game.physics.arcade.collide(player, endGameLayer);
		game.physics.arcade.collide(box, invisibleLayer);
		game.physics.arcade.overlap(player, box, () => {
			player.x += 1;
			canPush = true;
			!playerPushing ? player.body.velocity.x = 0 : null;
		});
		//----------------------------------------------------------

		// player dies if falls 3 floors
		//----------------------------------------------------------
		heightDiff = Math.abs(lastPosY - Math.floor(player.y / 10));
		if (Math.abs(lastPosY < Math.floor(player.y / 10)) && heightDiff >= 21) {
			playerAlive = false;
		}
		//----------------------------------------------------------

		// Continue game if player is not dead
		//----------------------------------------------------------
		if (!playerAlive) {
			player.animations.play("dead");
			clearInterval(playEndCheck);
			// setPlayerPlayed(playerTimestampId);
			endLevel();
		}
		//----------------------------------------------------------

		// If level completed, don't move
		//----------------------------------------------------------
		if (levelCompleted) {
			player.body.velocity.setTo(0);
		}
		//----------------------------------------------------------

		// If player is on Lader, climb action is possible
		//----------------------------------------------------------
		if (game.physics.arcade.collide(player, laderLayer)) {
			onLader = true;
		} else {
			onLader = false;
		}
		//----------------------------------------------------------

		// Update current height when on floor
		//----------------------------------------------------------
		if (player.body.blocked.down) {
			lastPosY = Math.floor(player.y / 10);
		}
		//----------------------------------------------------------

		/*
			Animation play conditions
			if player is alive
		*/
		//----------------------------------------------------------
		if (playerAlive || !levelCompleted) {
			if (player.body.velocity.x == 0 && player.body.blocked.down) {
				// Idle if x velocity is 0 and on floor
				player.frame = 23;
			} else if (player.body.velocity.x != 0 && player.body.blocked.down) {
				// Run if x velocity is NOT 0 and on floor
				if (playerPushing) {
					player.animations.play("push");
				} else {
					player.animations.play("walk");
				}
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
			if (!playerPushing) {
				movePlayer();
			} else {
				if (player.body.velocity.x == 0 && player.body.velocity.y == 0) {
					playerIsMoving = false;
				}
			}
		}
		//----------------------------------------------------------
	},
	render: () => {
		// Uncomment to show DEBUG MODE on Player
		// game.debug.spriteInfo(player, 32, 32);
		// game.debug.bodyInfo(player, 32, 120);
		// game.debug.spriteBounds(player);
		// game.debug.spriteInfo(box, 32, 32);
		// game.debug.bodyInfo(box, 32, 120);
		// game.debug.spriteBounds(box);
	},
};

/*
	Check player current position and destination
	and move it accordingly
*/
//----------------------------------------------------------
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
			Check if right side is blocked by tile
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

		// Check if right side is blocked by Sprite
		if (player.body.touching.right) {
			player.xDest = player.x;
		}
	} else if (currentPosX > destinationX) {
		playerIsMoving = true;
		player.body.velocity.x = -horizontal_speed;
		player.scale.setTo(-0.6, 0.6);
		/*
			Check if left side is blocked by tile
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

		// Check if left side is blocked by Sprite
		if (player.body.touching.left) {
			player.xDest = player.x;
		}

		if (player.body.velocity.x < 0) {
			playerIsMoving = true;
		}
	}
}
//----------------------------------------------------------

// Movements
//----------------------------------------------------------
function endLevel() {
	setTimeout(() => {
		// setPlayerPlayed(playerTimestampId);
		clearInterval(playEndCheck);
		clearActionsList();
		enableButtons();
		gameOver();
	}, 1000);
}

function runRight() {
	canPush = false;
	playerPushing = false;
	lastPosY = Math.floor(player.y / 10);
	player.xDest = player.x + 70 * 12;
}

function runLeft() {
	canPush = false;
	playerPushing = false;
	lastPosY = Math.floor(player.y / 10);
	player.xDest = player.x - 70 * 12;
}

function jumpRight() {
	canPush = false;
	playerPushing = false;
	lastPosY = Math.floor(player.y / 10);
	player.body.velocity.y = vertical_speed;
	player.yDest = player.y - 70 * 2;
	player.xDest = player.x + 70 * 2;
}

function jumpLeft() {
	canPush = false;
	playerPushing = false;
	lastPosY = Math.floor(player.y / 10);
	player.body.velocity.y = vertical_speed;
	player.yDest = player.y - 70 * 2;
	player.xDest = player.x - 70 * 2;
}

function climb() {
	canPush = false;
	if (onLader) {
		playerPushing = false;
		playerIsMoving = true;
		player.animations.play("climb");
		game.physics.arcade.gravity.y = 0;
		player.yDest = player.y - 70 * 1;
		player.body.velocity.y = vertical_speed * 0.2;
	}
}

function push() {
	if (canPush) {
		playerIsMoving = true;
		player.animations.play("push");
		if (!box.body.blocked.right) {
			playerPushing = true;
			player.body.velocity.x = horizontal_speed;
			box.body.velocity.x = horizontal_speed;
		} else if (!box.body.blocked.left) {
			playerPushing = true;
			box.body.immovable = false;
			player.body.velocity.x = horizontal_speed;
			box.body.velocity.x = horizontal_speed;
		}
		canPush = false;
	}
}
//----------------------------------------------------------

// Play commands
//----------------------------------------------------------
function play() {
	if (button) {
		button.destroy();
	}

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
			console.log(actionsArray[0]);
			eval(actionsArray[0] + "()");
			actionsArray.shift();
		}
		setTimeout(() => {
			clearInterval(playEndCheck);
			play();
		}, 500);
	}
}
//----------------------------------------------------------

// Clears command area
//----------------------------------------------------------
function clearActionsList() {
	const actionList = document.querySelector(".action-list ol");
	actionList.innerHTML = "";
	actionsArray = [];
}
//----------------------------------------------------------
