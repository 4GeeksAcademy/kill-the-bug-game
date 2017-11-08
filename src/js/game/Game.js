// Importing Game Styles
require("../../css/style.css");
// Importing Firebases
// require("../lib/firebase");

// Importing Game States
import { Boot } from "./Boot";
import { Preloader } from "./Preloader";
import { MainMenu } from "./MainMenu";
import { LevelOne } from "./LevelOne";

// Phaser start
export const game = new Phaser.Game(1024, 660, Phaser.AUTO, "game");
game.state.add("Boot", Boot);
game.state.add("Preloader", Preloader);
game.state.add("MainMenu", MainMenu);
game.state.add("LevelOne", LevelOne);

// Start game
game.state.start("Boot");
