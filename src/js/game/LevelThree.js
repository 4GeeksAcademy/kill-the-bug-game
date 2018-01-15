import { game } from "./Game";
import { gameOver } from "./GameOver";
import { showActionBoard, disableButtons, enableButtons, boardIsHidden } from "./scripts";
import { character, moves, playerId } from "./PlayerSelect";
import { deleteAttempt } from "../lib/Api";
import swal from "sweetalert";

/*
	Create event listener for each action button.
	Every button press stores last Y postion
	and sets X destination
*/
// Global vars
let currentAction = -1,
	HUD = "",
	worldLayer = "",
	laderLayer = "",
	invisibleLayer = "",
	fallLayer = "",
	boxLayer = "",
	onLader = "",
	heightDiff = "",
	bug = "",
	player = "",
	playerAlive = "",
	playerIsMoving = "",
	playEndCheck = "",
	box = "",
	lock = "",
	gravity = 500;
let levelCompleted = false;
// Movement vars
const horizontal_speed = 150;
const vertical_speed = -280;
let lastPosY = "";
let button;
let playerPushing = false,
	canPush = false;
let playerIsOpening = false,
	canOpen = false;
let boxes = "",
	lockes = "";
let canKill = false,
	playerIsKilling = false,
	bugIsDead = false;

let actionsArray = [];

/* ==================================
		LEVEL ONE !!!
===================================*/
export const LevelThree = {
	create: () => {
		currentAction = -1;
		HUD = document.querySelector(".HUD");
		HUD.style.opacity = 1;
		HUD.innerHTML = `
		<a class="show-map" href="assets/maps/cave_map_3.png" data-lightbox="cave_map_3" data-title="Cave #3">
			<i class="fa fa-map" aria-hidden="true"></i>
			Show Map
		</a>
		<a class="show-help" href="#help">
			<i class="fa fa-question" aria-hidden="true"></i>
			Help
		</a>`;
		// World
		//----------------------------------------------------------
		game.world.width = 1680;
		game.world.height = 1400;
		game.stage.backgroundColor = "#263238";
		let map = game.add.tilemap("level_3");
		map.addTilesetImage("spritesheet", "tiles"); // (name in JSON, name in preloader)
		laderLayer = map.createLayer("Lader Layer");
		worldLayer = map.createLayer("World Map Layer");
		map.createLayer("Liquid Layer");
		fallLayer = map.createLayer("Fall Layer");
		fallLayer.visible = false;
		boxLayer = map.createLayer("Box Layer");
		boxLayer.visible = false;
		invisibleLayer = map.createLayer("Invisible Layer");
		invisibleLayer.visible = false;
		map.setCollision(
			[104, 153, 133, 105, 152, 116, 81, 129, 145, 57, 69, 46, 58, 45],
			true,
			"World Map Layer"
		);
		map.setCollision(61, true, "Fall Layer");
		map.setCollision([20, 32], false, "Lader Layer");
		map.setCollision(145, true, "Box Layer");
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
				player.scale.setTo(0.39);
				player.body.velocity.x = horizontal_speed;
				player.xDest = player.xDest + 10;
				game.physics.arcade.gravity.y = gravity;
			},
			game,
			laderLayer
		);

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
		player = game.add.sprite(70 / 2, 1297, character);
		player.animations.add("walk", Phaser.Animation.generateFrameNames("walk/", 1, 3, ".png", 4), 8, true, false);
		player.animations.add("jump", Phaser.Animation.generateFrameNames("jump/", 1, 2, ".png", 4), 4, true, false);
		player.animations.add("dead", Phaser.Animation.generateFrameNames("dead/", 1, 1, ".png", 4), 10, false, false);
		player.animations.add("idle", Phaser.Animation.generateFrameNames("idle/", 1, 1, ".png", 4), 10, false, false);
		player.animations.add("open", Phaser.Animation.generateFrameNames("open/", 1, 1, ".png", 4), 10, false, false);
		player.animations.add("kill", Phaser.Animation.generateFrameNames("open/", 1, 1, ".png", 4), 10, false, false);
		player.animations.add("climb", Phaser.Animation.generateFrameNames("climb/", 1, 2, ".png", 4), 3, true, false);
		player.animations.add("push", Phaser.Animation.generateFrameNames("push/", 1, 2, ".png", 4), 6, true, false);
		player.animations.add("happy", Phaser.Animation.generateFrameNames("happy/", 1, 1, ".png", 4), 6, false, false);
		game.add.existing(player);
		lastPosY = Math.floor(player.y / 10);
		player.scale.setTo(0.39);
		player.anchor.setTo(0.5);
		//----------------------------------------------------------

		// ENEMY - BUG
		//----------------------------------------------------------
		bug = game.add.sprite(70 * 23 - 70 / 2, 1297, "bug");
		bug.animations.add("dead", Phaser.Animation.generateFrameNames("dead/", 1, 1, ".png", 4), 10, false, false);
		bug.animations.add("idle", Phaser.Animation.generateFrameNames("idle/", 1, 2, ".png", 4), 3, true, false);
		bug.animations.add("laugh", Phaser.Animation.generateFrameNames("laugh/", 1, 2, ".png", 4), 5, true, false);
		bug.scale.setTo(0.39);
		bug.anchor.setTo(0.5);
		game.add.existing(bug);
		//----------------------------------------------------------

		// Sprite Groups
		//----------------------------------------------------------
		boxes = game.add.group();
		lockes = game.add.group();
		//----------------------------------------------------------

		// Lock
		//----------------------------------------------------------
		game.add.sprite(70 * 4 + 35, 105, "objects", 54, lockes);
		game.add.sprite(70 * 7 + 35, 105, "objects", 54, lockes);
		game.add.sprite(70 * 10 + 35, 105, "objects", 54, lockes);
		game.add.sprite(70 * 13 + 35, 105, "objects", 54, lockes);
		game.add.sprite(70 * 16 + 35, 105, "objects", 54, lockes);
		game.add.sprite(70 * 19 + 35, 105, "objects", 54, lockes);
		game.add.sprite(70 * 18 + 35, 455, "objects", 54, lockes);
		game.add.sprite(70 * 21 + 35, 1087, "objects", 54, lockes);
		//----------------------------------------------------------

		// Box
		//----------------------------------------------------------
		game.add.sprite(70 * 5 + 35, 455, "objects", 144, boxes);
		game.add.sprite(70 * 10 + 35, 455, "objects", 144, boxes);
		//----------------------------------------------------------

		// Gravity and Physics
		//----------------------------------------------------------
		game.physics.arcade.enable([player, boxes, lockes, bug]);
		lockes.setAll("body.immovable", true);
		boxes.setAll("body.immovable", true);
		boxes.setAll("body.collideWorldBounds", true);
		boxes.setAll("body.gravity.y", 1000);
		bug.body.immovable = true;
		boxes.forEach(b => b.anchor.setTo(0.5));
		lockes.forEach(l => l.anchor.setTo(0.5));
		game.physics.arcade.gravity.y = gravity;
		bug.body.gravity = 0;
		player.body.collideWorldBounds = true;
		//----------------------------------------------------------

		// Camera
		//----------------------------------------------------------
		game.camera.follow(player);
		//----------------------------------------------------------

		// ACTIONS - MOVES
		//----------------------------------------------------------
		actionsArray = moves.length > 0 && moves[0] != "" ? [...moves] : [];
		if (actionsArray.length > 0) {
			button = game.add.button(
				game.camera.width / 2, game.camera.height / 2,
				"start_button", play, this,
				0, 1, 1
			);
			button.anchor.set(0.5);
			button.fixedToCamera = true;
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
			const actionList = document.querySelector(".command-queue ol");
			const actionData = button.dataset.action;

			button.addEventListener("click", function () {
				if (["runRight", "runLeft", "jumpRight", "jumpLeft", "climb", "open", "push", "kill"].includes(actionData) && playerAlive) {
					actionsArray.push(actionData);
					actionList.innerHTML += `<li class="command-queue__item command-queue__item--${actionData}"></li>`;
				} else {
					if (actionsArray.length > 0) {
						disableButtons();
						play();
					} else {
						swal({
							text: "Please, select actions first.",
							icon: "warning",
						});
					}
				}
			});
		});
		// ----------------------------------------------------------------

		document.querySelector(".command-queue__header button").addEventListener("click", clearActionsList);

		levelCompleted = false;
		playerAlive = true;
		bugIsDead = false;
	},
	update: () => {
		let distaceBetweenPlayerBug = Phaser.Math.distance(player.x, player.y, bug.x, bug.y).toFixed(2);
		if (!bugIsDead) {
			if (distaceBetweenPlayerBug < 350 || !playerAlive) {
				bug.animations.play("laugh");
			} else {
				bug.animations.play("idle");
			}
		} else {
			bug.animations.play("dead");
		}
		// COLLISION
		//----------------------------------------------------------
		game.physics.arcade.collide(boxes, invisibleLayer);
		game.physics.arcade.collide(lockes, worldLayer);
		game.physics.arcade.collide(player, worldLayer);
		game.physics.arcade.collide(player, boxLayer);
		// With empty spot while pushing
		playerPushing ? game.physics.arcade.collide(player, fallLayer, () => {
			player.xDest = player.x;
			setTimeout(() => playerPushing = false, 600);
		}) : null;
		// With Bug
		game.physics.arcade.overlap(player, bug, () => {
			player.xDest = player.x;
			canKill = true;
			player.body.velocity.x = 0;
		});
		// With pushable boxes
		game.physics.arcade.collide(player, boxes, (player, boxSprite) => {
			box = boxSprite;
			canPush = true;
			player.xDest = player.x;
			!playerPushing ? player.body.velocity.x = 0 : null;
		});
		// With locks
		game.physics.arcade.collide(player, lockes, (player, lockSprite) => {
			lock = lockSprite;
			player.xDest = player.x;
			canOpen = true;
			player.body.velocity.x = 0;
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
			player.y += 6;
			clearInterval(playEndCheck);
			endLevel();
		}
		//----------------------------------------------------------

		// If level completed, don't move
		//----------------------------------------------------------
		if (levelCompleted) {
			player.animations.play("happy");
			player.y += 6;
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
			if (player.body.velocity.x == 0 && player.body.blocked.down && !playerIsOpening && !playerIsKilling) {
				if (levelCompleted) {
					// Happy if x velocity is 0, on floor and level completed
					player.animations.play("happy");
				} else if (!playerAlive) {
					// Happy if x velocity is 0, on floor and level completed
					player.animations.play("dead");
				} else {
					// Idle if x velocity is 0 and on floor
					player.animations.play("idle");
				}
			} else if (player.body.velocity.x == 0 && player.body.blocked.down && playerIsOpening) {
				// While opening doors
				player.animations.play("open");
			} else if (player.body.velocity.x == 0 && player.body.blocked.down && playerIsKilling) {
				// While killing
				player.animations.play("kill");
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
			if (!playerPushing && !playerIsKilling) {
				movePlayer();
			}
		}
		//----------------------------------------------------------
	},
	render: () => {
		// Uncomment to show DEBUG MODE on Player
		// game.debug.spriteInfo(player, 32, 32);
		// game.debug.bodyInfo(player, 32, 120);
		// game.debug.spriteBounds(player);
		// game.debug.spriteInfo(boxes.children[1], 32, 32);
		// game.debug.bodyInfo(boxes.children[0], 32, 32);
		// game.debug.bodyInfo(boxes.children[1], 32, 120);
		// game.debug.spriteBounds(boxes.children[1]);
		// game.debug.cameraInfo(game.camera, 32, 32);
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
		player.scale.setTo(0.39);
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
		player.scale.setTo(-0.39, 0.39);
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
	// Promise.resolve(deleteAttempt(playerId)).then(() => {
	clearActionsList();
	enableButtons();
	gameOver();
	// });
}

function runRight() {
	canPush = false;
	lastPosY = Math.floor(player.y / 10);
	player.xDest = player.x + 70 * 24;
}

function runLeft() {
	canPush = false;
	lastPosY = Math.floor(player.y / 10);
	player.xDest = player.x - 70 * 24;
}

function jumpRight() {
	canPush = false;
	lastPosY = Math.floor(player.y / 10);
	player.body.velocity.y = vertical_speed;
	player.yDest = player.y - 70 * 2;
	player.xDest = player.x + 70 * 2;
}

function jumpLeft() {
	canPush = false;
	lastPosY = Math.floor(player.y / 10);
	player.body.velocity.y = vertical_speed;
	player.yDest = player.y - 70 * 2;
	player.xDest = player.x - 70 * 2;
}

function climb() {
	canPush = false;
	if (onLader) {
		playerIsMoving = true;
		player.animations.play("climb");
		game.physics.arcade.gravity.y = 0;
		player.yDest = player.y - 70 * 1;
		player.body.velocity.y = vertical_speed * 0.4;
	}
}

function push() {
	if (canPush) {
		playerIsMoving = true;
		player.animations.play("push");
		if (!box.body.blocked.right) {
			playerPushing = true;
			player.body.velocity.x = 108;
			box.body.velocity.x = 108;
		} else if (!box.body.blocked.left) {
			playerPushing = true;
			player.body.velocity.x = -108;
			box.body.velocity.x = -108;
		}
		canPush = false;
	}
}

function open() {
	if (canOpen) {
		playerIsOpening = true;
		player.animations.play("open");
		setTimeout(() => {
			lock.kill();
			canOpen = false;
			playerIsMoving = true;
			playerIsOpening = false;
		}, 300);
	}
}

function kill() {
	if (canKill) {
		playerIsKilling = true;
		player.animations.play("kill");
		setTimeout(() => {
			bugIsDead = true;
			canKill = false;
			playerIsMoving = true;
			playerIsKilling = false;
			setTimeout(() => {
				levelCompleted = true;
				player.x -= 5;
			}, 300);
		}, 300);
	}
}
//----------------------------------------------------------

// Play commands
//----------------------------------------------------------
function play() {
	HUD.style.opacity = 0;

	if (button) {
		button.destroy();
	}

	playEndCheck = setInterval(() => {
		if (!playerIsMoving && !levelCompleted && actionsArray.length == 0) {
			playerAlive = false;
			player.animations.play("dead");
			player.y += 6;
			clearInterval(playEndCheck);
			clearActionsList();
		} else if (!playerIsMoving && levelCompleted) {
			clearInterval(playEndCheck);
			endLevel();
		}
	}, 1000);

	if (actionsArray.length != 0) {
		let htmlQueue = document.querySelector(".queue");
		if (!playerIsMoving) {
			if (!boardIsHidden) {
				currentAction <= htmlQueue.children.length ? currentAction++ : 0;
				var previousAction = currentAction - 1 < 0 ? 0 : currentAction - 1;
				htmlQueue.children[currentAction].classList.contains("glow") ? null : htmlQueue.children[currentAction].classList.add("glow");
			}
			eval(actionsArray[0] + "()");
			actionsArray.shift();
			if (!boardIsHidden) {
				currentAction - 1 >= 0 ? htmlQueue.children[previousAction].classList.remove("glow") : null;
			}
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
	const actionList = document.querySelector(".command-queue ol");
	actionList.innerHTML = "";
	actionsArray = [];
}
//----------------------------------------------------------
