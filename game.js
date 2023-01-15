const GAME_SCENES_KEYS = {
    Menu: 'MenuScene',
    GuessInterval: 'GuessIntervalScene',
    Result: 'ResultScene'
}

const GAME_DATA = {
}
let gameLevelsInfo;

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
        GuessIntervalScene,
        ResultScene
    ],
};

let game = new Phaser.Game(config);