class StartScene extends Phaser.Scene {
    create() {
    }

    update() {
    }
}

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
        GuessIntervalScene
    ],
};

let player;
let playerLoadingPromise;
let yaGamesSDK;
YaGames.init({
    'screen': {
        'orientation': {
            'value': 'landscape',
            'lock': true
        }
    }
}).then(ysdk => {
    yaGamesSDK = ysdk;
    playerLoadingPromise = ysdk.getPlayer({ scopes: false }).then(_player => {
        player = _player
    });
});

let game = new Phaser.Game(config);