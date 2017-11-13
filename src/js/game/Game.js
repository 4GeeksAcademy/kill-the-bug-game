// Importing Game Styles
require("../../scss/style.scss");
// Importing Phaser Plugin
require("phaser-state-transition/dist/phaser-state-transition.min");
// Importing Firebases
// require("../lib/firebase");

// Importing Game States
import { Boot } from "./Boot";
import { Preloader } from "./Preloader";
import { MainMenu } from "./MainMenu";
import { LevelOne } from "./LevelOne";

// Phaser start
export const game = new Phaser.Game(840, 700, Phaser.AUTO, "game");
game.state.add("Boot", Boot);
game.state.add("Preloader", Preloader);
game.state.add("MainMenu", MainMenu);
game.state.add("LevelOne", LevelOne);

// Start game
game.state.start("Boot");
