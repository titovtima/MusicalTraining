class ResultScene extends Phaser.Scene {
    constructor() {
        super(GAME_SCENES_KEYS.Result);
    }

    create() {
        this.passLevel = !GAME_DATA.levelInfo.free_level &&
            GAME_DATA.result.rightAnswers >= GAME_DATA.levelInfo.need_to_pass_level;

        this.drawLevelName();
        this.drawResult();
        this.drawRepeatButton();
        if (this.passLevel && GAME_DATA.levelInfo.index < 11)
            this.drawNextLevelButton();
        this.drawMenuButton();
    }

    drawLevelName() {
        let string = GAME_DATA.levelInfo.index + ' - ' + GAME_DATA.levelInfo.name_ru;
        this.add.text(800, 100, string,
            { fontFamily: 'sans-serif', fontSize: 100, color: '#000' })
            .setOrigin(0.5);
    }

    drawResult() {
        let resultString = 'Ваш результат ' + GAME_DATA.result.rightAnswers + ' из ' + GAME_DATA.result.allAnswers;

        if (!GAME_DATA.levelInfo.free_level) {
            if (this.passLevel) {
                resultString += '\nПоздравляем! Вы прошли уровень!';
            } else {
                resultString += '\nПопробуйте ещё раз!\nНужно набрать '
                    + GAME_DATA.levelInfo.need_to_pass_level + ' из ' + GAME_DATA.levelInfo.number_of_tries;
            }
        }

        this.add.text(800, 450, resultString,
            { fontFamily: 'sans-serif', fontSize: 80, color: '#000', align: 'center' })
            .setOrigin(0.5);
    }

    drawRepeatButton() {
        let rect = this.add.rectangle(1200, 800, 700, 150, 0x00ee55)
            .setOrigin(0.5);
        this.add.text(1200, 800, 'Повторить уровень',
            { fontFamily: 'sans-serif', fontSize: 65, color: '#000' })
            .setOrigin(0.5);

        rect.setInteractive();
        rect.on('pointerup', () => {
            this.scene.start(GAME_SCENES_KEYS.GuessInterval);
        });
    }

    drawNextLevelButton() {
        let rect = this.add.rectangle(400, 800, 700, 150, 0x00ee55)
            .setOrigin(0.5);
        this.add.text(400, 800, 'Следующий уровень',
            { fontFamily: 'sans-serif', fontSize: 65, color: '#000' })
            .setOrigin(0.5);

        rect.setInteractive();
        rect.on('pointerup', () => {
            let levelsData = this.cache.json.get('levels');
            console.log(levelsData);
            GAME_DATA.levelInfo = levelsData.levels[GAME_DATA.levelInfo.index + 1];
            this.scene.start(GAME_SCENES_KEYS.GuessInterval);
        });
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
        })
    }
}