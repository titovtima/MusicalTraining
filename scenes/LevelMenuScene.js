class LevelMenuScene extends Phaser.Scene {

    constructor() {
        super(GAME_SCENES_KEYS.LevelMenu);
    }

    preload() {
        this.load.json(GAME_DATA.game.tag + 'Levels', 'jsonConfig/' + GAME_DATA.game.levelsFile);
        this.load.image('menuCardBackground', RESOURCES_PATH + 'rec800-500.png');
        this.load.image('info', RESOURCES_PATH + 'info.png');
        this.load.image('info_over', RESOURCES_PATH + 'info_over.png');
    }

    create() {
        this.loadPlayerDataPromise = playerLoadingPromise.then(() => player.getData());
        this.drawTitle();
        this.drawHomeButton();
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

    drawHomeButton() {
        let rect = this.add.rectangle(100, 70, 160, 100, 0x00ddff)
            .setOrigin(0.5);
        this.add.text(100, 70, 'Игры',
            { fontFamily: 'sans-serif', fontSize: 50, color: '#000' })
            .setOrigin(0.5);

        rect.setInteractive();
        rect.on('pointerup', () => {
            this.scene.start(GAME_SCENES_KEYS.GameMenu);
        });
    }

    drawLevelButtons() {
        let buttonWidth = 1600 / 4;
        let buttonHeight = 250;
        let imgScale = 0.45;

        let buttonX = buttonWidth / 2;
        let buttonY = 150 + buttonHeight / 2 ;

        let gameLevelsInfo = this.cache.json.get(GAME_DATA.game.tag + 'Levels');
        for (let level of gameLevelsInfo.levels) {
            let background = this.add.image(buttonX, buttonY, 'menuCardBackground')
                .setScale(imgScale).setOrigin(0.5);
            let number = this.add.text(buttonX, buttonY - 50, level.index,
                { fontFamily: 'sans-serif', fontSize: 80, color: '#000' })
                .setOrigin(0.5);
            let text = this.add.text(buttonX, buttonY + 10, level.name_ru,
                { fontFamily: 'sans-serif', fontSize: 50, color: '#000' })
                .setOrigin(0.5);
            this.addMaxScoreText(buttonX, buttonY + 70, level.index);

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

    addMaxScoreText(x, y, levelIndex) {
        this.loadPlayerDataPromise.then(playerData => {
            let maxResult = 0;
            if (playerData && playerData.levels_max_scores && playerData.levels_max_scores.guess_interval
                && playerData.levels_max_scores.guess_interval[levelIndex])
                maxResult = playerData.levels_max_scores.guess_interval[levelIndex];
            let allQuestions = this.gameLevelsInfo.levels[levelIndex - 1].number_of_tries;
            let string = 'Ваш рекорд: ' + maxResult;
            if (allQuestions)
                string += ' из ' + allQuestions;
            this.add.text(x, y, string, {fontFamily: 'sans-serif', fontSize: 35, color: '#000'})
                .setOrigin(0.5, 0.5);
        });
    }
}