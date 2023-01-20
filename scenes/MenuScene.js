class MenuScene extends Phaser.Scene {

    constructor() {
        super(GAME_SCENES_KEYS.Menu);
    }

    preload() {
        this.load.json('levels', 'levels.json');
        this.load.image('levelCardBackground', RESOURCES_PATH + 'rec800-500.png');
        this.load.image('info', RESOURCES_PATH + 'info.png');
        this.load.image('info_over', RESOURCES_PATH + 'info_over.png');
    }

    create() {
        this.drawTitle();
        this.drawInstructionsButton();
        this.drawLevelButtons();
    }

    drawTitle() {
        this.add.text(800, 75, 'Выберите уровень',
            { fontFamily: 'sans-serif', fontSize: 100, color: '#000' })
            .setOrigin(0.5);
    }

    drawInstructionsButton() {
        let instructionsButton = this.add.image(1580, 20, 'info')
            .setOrigin(1, 0)
            .setScale(100/1700);

        instructionsButton.setInteractive();
        instructionsButton.on('pointerup', () => {
            this.scene.start(GAME_SCENES_KEYS.Instructions);
        });

        instructionsButton.on('pointerover', () => {
            instructionsButton.setTexture('info_over');
        });
        instructionsButton.on('pointerout', () => {
            instructionsButton.setTexture('info');
        });
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

                ym(91864844,'reachGoal','start_level');
                let jsonString = `{ "start_level_${level.index}": 1 }`;
                ym(91864844, 'params', JSON.parse(jsonString));

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