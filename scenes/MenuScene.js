class MenuScene extends Phaser.Scene {

    constructor() {
        super(GAME_SCENES_KEYS.Menu);
    }

    create() {
        this.drawStartButton()
    }

    drawStartButton() {
        let startButton = this.add.rectangle(800, 450, 600, 200, 0x00ee55)
            .setOrigin(0.5);
        let startButtonText = this.add.text(800, 450, 'Начать',
            { fontFamily: 'sans-serif', fontSize: 70, color: '#000' })
            .setOrigin(0.5);

        startButton.setInteractive();
        startButton.on('pointerup', () => {
            this.scene.start(GAME_SCENES_KEYS.GuessInterval);
        });
    }
}