const GAME_SCENES_KEYS = {
    GameMenu: 'GameMenuScene',
    LevelMenu: 'LevelMenuScene',
    GuessInterval: 'GuessIntervalScene',
    Result: 'ResultScene',
    Instructions: 'InstructionsScene',
}

const GAME_DATA = {
}
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
        GameMenuScene,
        LevelMenuScene,
        InstructionsScene,
        GuessIntervalScene,
        ResultScene,
    ],
};

let game = new Phaser.Game(config);