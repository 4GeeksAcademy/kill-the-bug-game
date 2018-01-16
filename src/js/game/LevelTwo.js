import { game } from "./Game";
import { gameOver } from "./GameOver";
import { showActionBoard, disableButtons, enableButtons, boardIsHidden, gofull } from "./scripts";
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
	boxLayer = "",
	onLader = "",
	heightDiff = "",
	bug = "",
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
let canKill = false,
	playerIsKilling = false,
	bugIsDead = false;

let actionsArray = [];

/* ==================================
		LEVEL ONE !!!
===================================*/
export const LevelTwo = {
	create: () => {

		currentAction = -1;
		HUD = document.querySelector(".HUD");
		HUD.style.opacity = 1;
		HUD.innerHTML = `
		<a class="show-map" href="/img/levels/2.png" data-lightbox="cave_map_2" data-title="Map 2">
			<i class="fa fa-map" aria-hidden="true"></i>
			Show Map
		</a>
		<a class="show-help" href="#help">
			<i class="fa fa-question" aria-hidden="true"></i>
			Help
		</a>`;
		// World
		//----------------------------------------------------------
		game.world.width = 840;
		game.world.height = 700;

		game.stage.backgroundColor = "#5D4037";
		let map = game.add.tilemap("level_2");
		map.addTilesetImage("spritesheet", "tiles"); // (name in JSON, name in preloader)
		worldLayer = map.createLayer("World Map Layer");
		laderLayer = map.createLayer("Lader Layer");
		boxLayer = map.createLayer("Box Layer");
		boxLayer.visible = false;
		invisibleLayer = map.createLayer("Invisible Layer");
		invisibleLayer.visible = false;
		map.setCollision(
			[104, 153, 133, 105, 152, 81, 129, 145, 98],
			true,
			"World Map Layer"
		);
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
				player.scale.setTo(0.39);
				player.body.velocity.x = horizontal_speed;
				player.xDest = player.xDest + 15;
				game.physics.arcade.gravity.y = 500;
			},
			game,
			laderLayer
		);

		// Check collision box-wall
		//----------------------------------------------------------
		map.setTileIndexCallback(
			1,
			() => {
				playerPushing = false;
				playerIsMoving = false;
				player.xDest = player.x;
				box.kill();
				boxLayer.visible = true;
			},
			game,
			invisibleLayer
		);
		//----------------------------------------------------------

		// PLAYER
		//----------------------------------------------------------
		player = game.add.sprite(70 / 2, 597.4, character);
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
		//----------------------------------------------------------

		// ENEMY - BUG
		//----------------------------------------------------------
		bug = game.add.sprite(70 * 12 - 70 / 2, 179.5, "bug");
		bug.animations.add("dead", Phaser.Animation.generateFrameNames("dead/", 1, 1, ".png", 4), 10, false, false);
		bug.animations.add("idle", Phaser.Animation.generateFrameNames("idle/", 1, 2, ".png", 4), 3, true, false);
		bug.animations.add("laugh", Phaser.Animation.generateFrameNames("laugh/", 1, 2, ".png", 4), 5, true, false);
		bug.scale.setTo(0.39);
		bug.anchor.setTo(0.5);
		game.add.existing(bug);
		//----------------------------------------------------------

		// Box
		//----------------------------------------------------------
		box = game.add.sprite(70 * 3, 560, "objects");
		box.frame = 144;
		//----------------------------------------------------------

		// Player scales and center anchor
		//----------------------------------------------------------
		player.scale.setTo(0.39);
		player.anchor.setTo(0.5);
		//----------------------------------------------------------

		// Gravity and Physics
		//----------------------------------------------------------
		game.physics.arcade.enable([player, box, bug]);
		box.body.immovable = true;
		bug.body.immovable = true;
		game.physics.arcade.gravity.y = 500;
		bug.body.gravity = 0;
		player.body.collideWorldBounds = true;
		box.body.collideWorldBounds = true;
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
			let text = game.add.text(0, 0, "RUN", {
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
			if (distaceBetweenPlayerBug < 250 || !playerAlive) {
				bug.animations.play("laugh");
			} else {
				bug.animations.play("idle");
			}
		} else {
			bug.animations.play("dead");
		}
		// COLLISION
		//----------------------------------------------------------
		game.physics.arcade.collide(box, invisibleLayer);
		game.physics.arcade.collide(player, worldLayer);
		game.physics.arcade.collide(player, boxLayer);
		game.physics.arcade.collide(box, invisibleLayer);
		game.physics.arcade.overlap(player, box, () => {
			canPush = true;
			!playerPushing ? player.body.velocity.x = 0 : null;
		});
		// Check collision with Bug
		game.physics.arcade.overlap(player, bug, () => {
			player.xDest = player.x;
			canKill = true;
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
			if (player.body.velocity.x == 0 && player.body.blocked.down && !playerIsKilling) {
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
			player.x = player.x - 15;
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
			player.x = player.x + 15;
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
