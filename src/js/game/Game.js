// Importing Lightbox2 plus jQuery
require("lightbox2/dist/css/lightbox.css");
require("lightbox2/dist/js/lightbox-plus-jquery");
// Importing Game Styles
require("../../scss/style.scss");
// Importing Phaser Plugin
require("phaser-state-transition/dist/phaser-state-transition.min");
// Importing Api Data
require("../lib/Api");

// Importing Game States
import { Boot } from "./Boot";
import { Preloader } from "./Preloader";
import { MainMenu } from "./MainMenu";
import { MapSelect } from "./MapSelect";
import { PlayerSelect } from "./PlayerSelect";
import { LevelOne } from "./LevelOne";
import { LevelTwo } from "./LevelTwo";
import { LevelThree } from "./LevelThree";

// Phaser start
export const game = new Phaser.Game(840, 700, Phaser.AUTO, "game");
game.state.add("Boot", Boot);
game.state.add("Preloader", Preloader);
game.state.add("MainMenu", MainMenu);
game.state.add("MapSelect", MapSelect);
game.state.add("PlayerSelect", PlayerSelect);
game.state.add("LevelOne", LevelOne);
game.state.add("LevelTwo", LevelTwo);
game.state.add("LevelThree", LevelThree);

// Start game
game.state.start("Boot");