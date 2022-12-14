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

let game = new Phaser.Game(config);