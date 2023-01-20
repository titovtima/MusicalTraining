const GAME_SCENES_KEYS = {
    Menu: 'MenuScene',
    GuessInterval: 'GuessIntervalScene',
    Result: 'ResultScene',
    Instructions: 'InstructionsScene',
}

const GAME_DATA = {
}
let gameLevelsInfo;
const RESOURCES_PATH = 'assets/';

const config = {
    // type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1600,
        height: 900,
    },
    transparent: true,
    scene: [
        MenuScene,
        InstructionsScene,
        GuessIntervalScene,
        ResultScene,
    ],
};

let game = new Phaser.Game(config);