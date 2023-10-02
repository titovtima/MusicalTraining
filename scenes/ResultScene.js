class ResultScene extends Phaser.Scene {
    constructor() {
        super(GAME_SCENES_KEYS.Result);
    }

    create() {
        this.passLevel = !GAME_DATA.levelInfo.free_level &&
            GAME_DATA.result.rightAnswers >= GAME_DATA.levelInfo.need_to_pass_level;

        if (this.passLevel) {
            ym(91864844,'reachGoal','win_level');
        }

        let jsonString = `{ "score_level_${GAME_DATA.levelInfo.index}": ${GAME_DATA.result.rightAnswers} }`;
        ym(91864844, 'params', JSON.parse(jsonString));

        this.drawLevelName();
        this.drawResult();
        this.drawIntervalsList();
        this.drawRepeatButton();
        if (this.passLevel && GAME_DATA.levelInfo.index < 11)
            this.drawNextLevelButton();
        this.drawMenuButton();
        this.updatePlayerData();
    }

    drawLevelName() {
        let string = GAME_DATA.levelInfo.index + ' - ' + GAME_DATA.levelInfo.name_ru;
        this.add.text(800, 75, string,
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

        this.resultText = this.add.text(800, 200, resultString,
            { fontFamily: 'sans-serif', fontSize: 70, color: '#000', align: 'center' })
            .setOrigin(0.5, 0);
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
            GAME_DATA.levelInfo = levelsData.levels[GAME_DATA.levelInfo.index];
            this.scene.start(GAME_SCENES_KEYS.GuessInterval);
        });
    }

    drawIntervalsList() {
        let label = this.add.text(800, 500, 'Набор интервалов:',
            { fontFamily: 'sans-serif', fontSize: 60, color: '#000' })
            .setOrigin(0.5, 0);
        let string = '';
        for (let interval of GAME_DATA.intervalsList) {
            string += ', ' + MusicTheory.getIntervalNameByNotesIdsDifference(interval[1]);
        }

        string = string.substring(2);

        this.add.text(800, 500 + label.height, string,
            { fontFamily: 'sans-serif', fontSize: 40, color: '#000' , wordWrap: { width: 1500 }, align: 'center' })
            .setOrigin(0.5, 0);
    }

    drawMenuButton() {
        let rect = this.add.rectangle(1425, 100, 300, 150, 0x00ee55)
            .setOrigin(0.5);
        this.add.text(1425, 100, 'Меню',
            { fontFamily: 'sans-serif', fontSize: 65, color: '#000' })
            .setOrigin(0.5);

        rect.setInteractive();
        rect.on('pointerup', () => {
            this.scene.start(GAME_SCENES_KEYS.LevelMenu);
        });
    }

    async updatePlayerData() {
        // console.log('loading player data');
        let data = await player.getData();
        if (!data.levels_max_scores)
            data.levels_max_scores = {};
        if (!data.levels_max_scores.guess_interval)
            data.levels_max_scores.guess_interval = {}
        if (!data.levels_max_scores.guess_interval[GAME_DATA.levelInfo.index])
            data.levels_max_scores.guess_interval[GAME_DATA.levelInfo.index] = 0;
        let prevMax = data.levels_max_scores.guess_interval[GAME_DATA.levelInfo.index]
        if (GAME_DATA.result.rightAnswers > prevMax) {
            this.resultText.setText(this.resultText.text + '\nУ Вас новый рекорд!');
            data.levels_max_scores.guess_interval[GAME_DATA.levelInfo.index] = GAME_DATA.result.rightAnswers;
            player.setData(data);
        }
    }
}