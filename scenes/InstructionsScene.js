class InstructionsScene extends Phaser.Scene {
    constructor() {
        super(GAME_SCENES_KEYS.Instructions);
    }

    create() {
        this.drawMenuButton();
    }

    drawMenuButton() {
        let rect = this.add.rectangle(1425, 100, 300, 150, 0x00ee55)
            .setOrigin(0.5);
        this.add.text(1425, 100, 'Меню',
            { fontFamily: 'sans-serif', fontSize: 65, color: '#000' })
            .setOrigin(0.5);

        rect.setInteractive();
        rect.on('pointerup', () => {
            this.scene.start(GAME_SCENES_KEYS.Menu);
        });
    }

    drawInstructions() {
        let text = '';
    }
}