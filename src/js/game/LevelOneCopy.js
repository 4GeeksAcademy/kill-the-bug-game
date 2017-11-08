import { playersArr } from './firebase';
// GLOBAL VARS
const game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });	
const inputArea = document.getElementById('input-area');
const button = document.querySelector('button');
let playersData, gameData, player, character,
	ground_platforms, float_ground_platforms, ground_tile;

function preload()
{
	// LOAD DATA
	game.load.json('playersData', 'config/players.json');
	game.load.json('gameData', 'config/game.json');
	// Background
	game.load.image('background', 'assets/backgrounds/BG.png');
	// ground
	game.load.image('ground0', 'assets/tiles/ground0.png');
	game.load.image('ground1', 'assets/tiles/ground1.png');
	game.load.image('ground2', 'assets/tiles/ground2.png');
	// floating ground
	game.load.image('f_ground0', 'assets/tiles/f_ground0.png');
	game.load.image('f_ground1', 'assets/tiles/f_ground1.png');
	game.load.image('f_ground2', 'assets/tiles/f_ground2.png');
	// character
	game.load.atlasJSONArray('boy', '/assets/players/boy/boy.png', '/assets/players/boy/boy.json');
	// game.load.atlasJSONArray('girl', '/assets/players/girl/player.png', '/assets/players/girl/player.json');
}

function create()
{
	// Parse Config Data
	gameData = game.cache.getJSON('gameData');
	// character = playersArr[0].character;

	game.physics.startSystem(Phaser.Physics.ARCADE);
	// Background
	game.add.tileSprite(0, 0, 800, 600, 'background');
	// GROUND
	const ground_tile_height = 128 * .8;
	ground_platforms = game.add.group();
	ground_platforms.enableBody = true;
	for (let i = 0; i < 9; i++)
	{
		let positionX = (ground_tile_height * i) - (ground_tile_height / 2);
		let positionY = game.world.height - (ground_tile_height / 2);
		if (i == 0)
		{
			ground_tile = ground_platforms.create(positionX, positionY, 'ground0');
		}
		else if (i == 9 - 1)
		{
			ground_tile = ground_platforms.create(positionX, positionY, 'ground2');
		}
		else
		{
			ground_tile = ground_platforms.create(positionX, positionY, 'ground1');
		}
		ground_tile.scale.setTo(.8);
		ground_tile.anchor.setTo(.5);
		ground_tile.body.immovable = true;
	}

	float_ground_platforms = game.add.group();
	float_ground_platforms.enableBody = true;
	for (let i = 4; i < 7; i++)
	{
		let positionX = (ground_tile_height * i) - (ground_tile_height / 2);
		let positionY = game.world.height - ground_tile_height * 3;
		if (i == 4)
		{
			ground_tile = float_ground_platforms.create(positionX, positionY, 'f_ground0');
		}
		else if (i == 7 - 1)
		{
			ground_tile = float_ground_platforms.create(positionX, positionY, 'f_ground2');
		}
		else
		{
			ground_tile = float_ground_platforms.create(positionX, positionY, 'f_ground1');
		}
		ground_tile.scale.setTo(.8);
		ground_tile.anchor.setTo(.5);
		ground_tile.body.immovable = true;
	}

	// PLAYER
	player = game.add.sprite(ground_tile_height / 2, game.world.height - (ground_tile_height / 2) - (486 * .25), character, `idle/000.png`);
	player.animations.add('idle', Phaser.Animation.generateFrameNames('idle/', 0, 10, '.png', 3), 13, true, false);
	player.animations.add('dead', Phaser.Animation.generateFrameNames('dead/', 0, 10, '.png', 3), 13, false, false);
	player.animations.add('jump', Phaser.Animation.generateFrameNames('jump/', 0, 10, '.png', 3), 8, true, false);
	player.animations.add('run', Phaser.Animation.generateFrameNames('run/', 0, 10, '.png', 3), 13, true, false);
	player.animations.add('slide', Phaser.Animation.generateFrameNames('slide/', 0, 10, '.png', 3), 13, false, false);
	player.scale.setTo(.25);
	player.anchor.setTo(.5);
	game.physics.arcade.enable(player);
	player.body.bounce.y = 0.01;
	player.body.gravity.y = 500;
	player.body.collideWorldBounds = true;
	// Camera
	game.camera.follow(player);
}

function update()
{
	// Speed
	const horizontal_speed = 150;
	const vertical_speed = -350;
	// COLLISION
	const hitPlatform = game.physics.arcade.collide(player, ground_platforms);
	game.physics.arcade.collide(player, float_ground_platforms);

	function runRight(spaces = 1)
	{
		game.physics.arcade.moveToXY(player, player.body.x + (178 * spaces), 1000, null, spaces * 1000);
		player.scale.setTo(.3, .3);
		player.animations.play('run');
		stopMovementAtDestination();
	}

	function runLeft(spaces = 2)
	{
		game.physics.arcade.moveToXY(player, 128, 0, -horizontal_speed);
		player.scale.setTo(-0.3, .3);
		player.animations.play('run');
		stopMovementAtDestination();
	}

	function jump()
	{
		if (player.scale.x > 0 && hitPlatform && player.body.touching.down)
		{
			player.body.velocity.y = vertical_speed;
			player.body.velocity.x = horizontal_speed + 30;
			player.animations.play('jump');
		}
		else if (player.scale.x < 0 && hitPlatform && player.body.touching.down)
		{
			player.body.velocity.y = vertical_speed;
			player.body.velocity.x = -horizontal_speed;
			player.animations.play('jump');
		}
		stopMovement(3 * 480);
	}

	function stopMovementAtDestination(targetPos = player.body.position + 128, currentPos = player.body.position.x)
	{

		console.log(targetPos, currentPos);
		return;
	}

	if (player.body.velocity.x === 0)
	{
		player.animations.play('idle');
	}

	if (player.body.velocity.x !== 0 && player.body.velocity.y === 0)
	{
		player.animations.play('run');
	}
}


button.addEventListener('click', () =>
{
	// Do nothing if textarea is empty
	if (inputArea.value.length !== 0)
	{
		// Filter inputs from error and non-existent actions
		let input = inputArea.value.split(';');
		let actions = input.filter( (action) => {
			if (action.match(/(jump|runRight|runLeft)\(\d?\)/g))
			{
				return true;
			}
			return false;
		});
	}

	writePlayerData(name);
});

// Start game when player's data is received

	