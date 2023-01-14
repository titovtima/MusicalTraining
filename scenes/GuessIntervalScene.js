class GuessIntervalScene extends Phaser.Scene {

    constructor() {
        super(GAME_SCENES_KEYS.GuessInterval);
    }

    preload() {
        for (let i = 0; i < 24; i++)
            this.load.audio('note_' + i, 'sounds/' + i + '.mp3');
    }

    create() {
        this.heading = this.add.text(800, 50, "Угадайте интервал по звучанию",
            { fontFamily: 'sans-serif', fontSize: 80, color: '#000' }).setOrigin(0.5, 0);

        this.piano = new Piano(this, 100, 500, 250, 100);
        this.piano.draw();
        this.piano.setVisibility(false);

        this.intervalsList = [[2, 3], [2, 4]];
        this.isChoosingIntervals = false;

        this.getIntervalsListFromCookie();
        this.drawSetIntervalsListButton();
        this.guessRandomInterval();
    }

    findCookies() {
        let cookies = {};
        document.cookie.split('; ').forEach(value => {
            let pair = value.split('=');
            cookies[pair[0]] = pair[1];
        });
        return cookies;
    }

    getIntervalsListFromCookie() {
        let cookie = this.findCookies().intervals_list;
        if (cookie) {
            this.intervalsList = [];
            let cookieList = cookie.split(',');
            for (let i = 0; i < cookieList.length; i += 2) {
                this.intervalsList.push([Number(cookieList[i]), Number(cookieList[i+1])]);
            }
            this.intervalsList.sort((a, b) => a[1] - b[1]);
        }
    }

    guessRandomInterval() {
        this.sound.stopAll();
        if (this.intervalsButtonsList)
            for (let button of this.intervalsButtonsList) {
                button.rect.destroy();
                button.text.destroy();
            }
        this.heading.setText('Какой интервал звучит?');
        let notesList = [[0,0], [0,1], [1, 1], [1, 2], [1, 3], [2, 3], [2, 4],
            [3, 5], [3, 6], [4, 6], [4, 7], [4, 8], [5, 8], [5, 9], [5, 10], [6, 10], [6, 11]];
        let lowNoteNumber = Math.floor(Math.random() * notesList.length);
        let lowNote = MusicTheory.createNoteWithOctave(notesList[lowNoteNumber][0], notesList[lowNoteNumber][1]);
        let intervalNumber = Math.floor(Math.random() * this.intervalsList.length)
        let naturalsDiff = this.intervalsList[intervalNumber][0];
        let idsDiff = this.intervalsList[intervalNumber][1];
        this.interval = MusicTheory.createIntervalByNoteAndDiffs(lowNote, naturalsDiff, idsDiff);

        let highNoteId = this.interval.highNote.noteId;

        if (highNoteId < 12) {
            if (Math.random() < 0.5) {
                lowNote = MusicTheory.createNoteWithOctave(lowNote.noteId + 12, lowNote.natural + 7);
                this.interval = MusicTheory.createIntervalByNoteAndDiffs(lowNote, naturalsDiff, idsDiff);
                highNoteId += 12
            }
        }
        if (idsDiff === 6)
            this.interval.name_ru = 'тритон';
        let lowNoteId = lowNote.noteId;

        this.lowNoteSound = this.sound.add('note_' + lowNoteId);
        this.highNoteSound = this.sound.add('note_' + highNoteId);
        // this.sound.play('note_' + highNoteId);
        this.lowNoteSound.play();
        this.highNoteSound.play();

        this.drawIntervalsButtons();

        for (let button of this.intervalsButtonsList) {
            let rect = button.rect;

            rect.setInteractive();
            rect.on('pointerup', () => {
                this.intervalChosen(button.interval_name);
            });
        }
        if (!this.repeatButtons)
            this.drawRepeatButtons();
        // this.piano.pressKeys([lowNoteId, highNoteId]);
    }

    drawIntervalsButtons(intervalsList = this.intervalsList) {
        let buttonWidth = 1600 / 3;
        let buttonHeight = 150;
        let x = buttonWidth / 2;
        let y = 150 + buttonHeight / 2;
        this.intervalsButtonsList = [];
        for (let interval of intervalsList) {
            let rect = this.add.rectangle(x, y, buttonWidth - 20, buttonHeight - 20, 0x00ffff)
                .setOrigin(0.5);

            let name = MusicTheory.getIntervalNameByNotesIdsDifference(interval[1]);
            let text = this.add.text(x, y, name, { fontFamily: 'sans-serif', fontSize: 50, color: '#000' })
                .setOrigin(0.5);

            this.intervalsButtonsList.push({
                'rect': rect,
                'text': text,
                'interval_name': name,
                'interval_numbers': interval
            });

            x += buttonWidth;
            if (x > 1600) {
                y += buttonHeight;
                x = buttonWidth / 2;
            }
         }
    }

    intervalChosen(intervalName) {
        this.piano.setVisibility(true);
        this.piano.pressKeys([this.interval.lowNote.noteId, this.interval.highNote.noteId]);
        if (intervalName === this.interval.name_ru) {
            this.heading.setText('Правильно!');
            this.drawOnlyRightAnswerButton(this.interval.name_ru);
        } else {
            this.heading.setText('Неверно, попробуйте ещё раз!');
            this.drawWrongAndRightAnswerButtons(intervalName, this.interval.name_ru);
        }
        for (let button of this.intervalsButtonsList) {
            button.rect.destroy();
            button.text.destroy();
        }

        if (this.buttonNext) {
            this.buttonNext.rect.destroy();
            this.buttonNext.text.destroy();
            this.buttonNext = null;
        }
        let buttonNext = this.add.rectangle(800, 400, 700, 150, 0x00ee55)
            .setOrigin(0.5);
        let buttonNextText = this.add.text(800, 400, 'Следующий интервал',
            { fontFamily: 'sans-serif', fontSize: 60, color: '#000' })
            .setOrigin(0.5);
        this.buttonNext = {
            'rect': buttonNext,
            'text': buttonNextText
        };

        buttonNext.setInteractive();
        buttonNext.on('pointerup', () => {
            if (this.rightAnswerButton) {
                this.rightAnswerButton.rect.destroy();
                this.rightAnswerButton.text.destroy();
                this.rightAnswerButton = null;
            }
            if (this.wrongAnswerButton) {
                this.wrongAnswerButton.rect.destroy();
                this.wrongAnswerButton.text.destroy();
                this.wrongAnswerButton = null;
            }

            buttonNextText.destroy();
            buttonNext.destroy();
            this.buttonNext = null;
            this.piano.clear();
            this.piano.setVisibility(false);

            this.guessRandomInterval();
        });
    }

    drawOnlyRightAnswerButton(rightAnswerText) {
        let rect = this.add.rectangle(800, 225, 533, 150, 0x00ff44)
            .setOrigin(0.5);
        let text = this.add.text(800, 225, rightAnswerText,
            { fontFamily: 'sans-serif', fontSize: 50, color: '#000' })
            .setOrigin(0.5);

        this.rightAnswerButton = {
            'rect': rect,
            'text': text
        };
    }

    drawWrongAndRightAnswerButtons(wrongAnswerText, rightAnswerText) {
        let rect1 = this.add.rectangle(400, 225, 533, 150, 0xff5555)
            .setOrigin(0.5);
        let text1 = this.add.text(400, 225, wrongAnswerText,
            { fontFamily: 'sans-serif', fontSize: 50, color: '#000' })
            .setOrigin(0.5);

        this.wrongAnswerButton = {
            'rect': rect1,
            'text': text1
        };

        let rect2 = this.add.rectangle(1200, 225, 533, 150, 0x00ff44)
            .setOrigin(0.5);
        let text2 = this.add.text(1200, 225, rightAnswerText,
            { fontFamily: 'sans-serif', fontSize: 50, color: '#000' })
            .setOrigin(0.5);

        this.rightAnswerButton = {
            'rect': rect2,
            'text': text2
        };
    }

    drawRepeatButtons() {
        let playTogetherRect = this.add.rectangle(1333, 820, 500, 120, 0x00ee55).
            setOrigin(0.5);
        let playTogetherText = this.add.text(1333, 820, "сыграть\nвместе",
            { fontFamily: 'sans-serif', fontSize: 50, color: '#000', align: 'center' })
            .setOrigin(0.5);

        playTogetherRect.setInteractive();
        playTogetherRect.on('pointerup', () => {
            this.lowNoteSound.play();
            this.highNoteSound.play();
        });

        this.repeatButtons = [{
            'rect': playTogetherRect,
            'text': playTogetherText
        }];

        let playByOneRect = this.add.rectangle(800, 820, 500, 120, 0x00ee55).
        setOrigin(0.5);
        let playByOneText = this.add.text(800, 820, "сыграть\nпо очереди",
            { fontFamily: 'sans-serif', fontSize: 50, color: '#000', align: 'center' })
            .setOrigin(0.5);

        playByOneRect.setInteractive();
        playByOneRect.on('pointerup', () => {
            this.lowNoteSound.play();
            setTimeout(() => { this.highNoteSound.play(); }, 500);
        });

        this.repeatButtons.push({
            'rect': playByOneRect,
            'text': playByOneText
        })
    }

    drawSetIntervalsListButton() {
        let buttonRect = this.add.rectangle(266, 820, 500, 120, 0x00ee55).
        setOrigin(0.5);
        let buttonText = this.add.text(266, 820, "изменить\nнабор интервалов",
            { fontFamily: 'sans-serif', fontSize: 45, color: '#000', align: 'center' })
            .setOrigin(0.5);

        buttonRect.setInteractive();
        buttonRect.on('pointerup', () => {
            this.changeIntervalsList();
        });

        this.setIntervalsListButton = {
            'rect': buttonRect,
            'text': buttonText
        }
    }

    changeIntervalsList() {
        if (this.isChoosingIntervals)
            return;
        this.isChoosingIntervals = true;
        this.piano.clear();
        this.piano.setVisibility(false);
        this.sound.stopAll();
        this.heading.setText('Выберите интервалы');
        if (this.setIntervalsListButton) {
            this.setIntervalsListButton.rect.destroy();
            this.setIntervalsListButton.text.destroy();
            this.setIntervalsListButton = null;
        }
        if (this.buttonNext) {
            this.buttonNext.rect.destroy();
            this.buttonNext.text.destroy();
            this.buttonNext = null;
        }
        if (this.repeatButtons) {
            for (let button of this.repeatButtons) {
                button.rect.destroy();
                button.text.destroy();
            }
            this.repeatButtons = null;
        }
        if (this.intervalsButtonsList)
            for (let button of this.intervalsButtonsList) {
                button.rect.destroy();
                button.text.destroy();
            }
        let allIntervals = [[1, 1], [1, 2], [2, 3], [2, 4], [3, 5], [3, 6],
            [4, 7], [5, 8], [5, 9], [6, 10], [6, 11], [7, 12]];
        this.drawIntervalsButtons(allIntervals);
        for (let button of this.intervalsButtonsList) {
            button.rect.fillColor = 0xff5555;
        }
        for (let interval of this.intervalsList) {
            for (let button of this.intervalsButtonsList) {
                if (button.interval_numbers[1] === interval[1]) {
                    button.rect.fillColor = 0x00ff44;
                }
            }
        }
        for (let button of this.intervalsButtonsList) {
            let rect = button.rect;

            rect.setInteractive();
            rect.on('pointerup', () => {
                let hasInterval = false;
                for (let interval of this.intervalsList) {
                    if (interval[1] === button.interval_numbers[1]) {
                        hasInterval = true;
                        this.intervalsList = this.intervalsList.filter(value => value !== interval);
                        rect.fillColor = 0xff5555;
                    }
                }
                if (!hasInterval) {
                    this.intervalsList.push(button.interval_numbers);
                    this.intervalsList.sort((a, b) => a[1] - b[1]);
                    rect.fillColor = 0x00ff44;
                }
            });
        }

        let startButton = this.add.rectangle(800, 820, 700, 120, 0x00ee55)
            .setOrigin(0.5);
        let startButtonText = this.add.text(800, 820, 'Начать',
            { fontFamily: 'sans-serif', fontSize: 70, color: '#000' })
            .setOrigin(0.5);

        startButton.setInteractive();
        startButton.on('pointerup', () => {
            startButton.destroy();
            startButtonText.destroy();
            document.cookie = `intervals_list=${this.intervalsList.flat().toString()}`;
            this.drawSetIntervalsListButton();
            this.isChoosingIntervals = false;
            this.guessRandomInterval();
        })
    }
}