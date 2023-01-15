class MenuScene extends Phaser.Scene {

    constructor() {
        super(GAME_SCENES_KEYS.Menu);
    }

    preload() {
        this.load.json('levels', 'levels.json');
        this.load.image('levelCardBackground', 'assets/rec800-500.png');
    }

    create() {
        // this.drawStartButton();
        this.drawTitle();
        this.drawLevelButtons()
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

    drawTitle() {
        this.add.text(800, 50, 'Выберите уровень',
            { fontFamily: 'sans-serif', fontSize: 80, color: '#000' })
            .setOrigin(0.5);

        this.add.text(800, 120, 'Старая версия игры - свободный уровень (12)',
            { fontFamily: 'sans-serif', fontSize: 35, color: '#000' })
            .setOrigin(0.5);
    }

    drawLevelButtons() {
        let buttonWidth = 1600 / 4;
        let buttonHeight = 250;
        let imgScale = 0.45;

        let buttonX = buttonWidth / 2;
        let buttonY = 150 + buttonHeight / 2 ;

        gameLevelsInfo = this.cache.json.get('levels');
        for (let level of gameLevelsInfo.levels) {
            let background = this.add.image(buttonX, buttonY, 'levelCardBackground')
                .setScale(imgScale).setOrigin(0.5);
            let number = this.add.text(buttonX, buttonY - 50, level.index,
                { fontFamily: 'sans-serif', fontSize: 80, color: '#000' })
                .setOrigin(0.5);
            let text = this.add.text(buttonX, buttonY + 50, level.name_ru,
                { fontFamily: 'sans-serif', fontSize: 50, color: '#000' })
                .setOrigin(0.5);

            background.setInteractive();
            background.on('pointerup', () => {
                console.log('start level ' + level.index);
                GAME_DATA.levelInfo = level;
                this.scene.start(GAME_SCENES_KEYS.GuessInterval);
            });

            buttonX += buttonWidth;
            if (buttonX > 1600) {
                buttonX = buttonWidth / 2;
                buttonY += buttonHeight;
            }
        }
    }
}