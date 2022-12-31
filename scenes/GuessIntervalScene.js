class GuessIntervalScene extends Phaser.Scene {

    preload() {
        for (let i = 0; i < 24; i++)
            this.load.audio('note_' + i, 'sounds/' + i + '.mp3');
    }

    create() {
        this.heading = this.add.text(800, 50, "Угадайте интервал по звучанию",
            { fontFamily: 'sans-serif', fontSize: 80, color: '#000' }).setOrigin(0.5, 0);

        this.piano = new Piano(this, 0, 650, 250, 80);
        this.piano.draw();

        this.intervalsList = [[1, 1], [1, 2], [2, 3], [2, 4]];

        this.getIntervalsListFromCookie();
        this.drawStartButton();
        this.drawSettingsButton();
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
            this.intervalsList.sort(function(a, b) {
                if (a[0] !== b[0]) return a[0] - b[0];
                else return a[1] - b[1];
            });
        }
    }

    drawStartButton() {
        let startButton = this.add.rectangle(800, 450, 600, 200, 0x00ee55)
            .setOrigin(0.5);
        let startButtonText = this.add.text(800, 450, 'Начать',
            { fontFamily: 'sans-serif', fontSize: 70, color: '#000' })
            .setOrigin(0.5);

        this.startButton = {
            'rect': startButton,
            'text': startButtonText
        };

        startButton.setInteractive();
        startButton.on('pointerup', () => {
            this.startButton = undefined;
            startButton.destroy();
            startButtonText.destroy();
            this.guessRandomInterval();
        });
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
                this.intervalChosen(button.intervalName);
            });
        }
        if (!this.repeatButtons)
            this.drawRepeatButtons();
        // this.piano.pressKeys([lowNoteId, highNoteId]);
    }

    drawIntervalsButtons(intervalsList = this.intervalsList) {
        let buttonWidth = 1600 / 4;
        let buttonHeight = 100;
        let x = buttonWidth / 2;
        let y = 150 + buttonHeight / 2;
        this.intervalsButtonsList = [];
        for (let interval of intervalsList) {
            let rect = this.add.rectangle(x, y, buttonWidth - 20, buttonHeight - 20, 0x00ffff)
                .setOrigin(0.5);

            let name = MusicTheory.getIntervalNameByDifferenceNumbers(interval[0], interval[1]);
            let text = this.add.text(x, y, name, { fontFamily: 'sans-serif', fontSize: 35, color: '#000' })
                .setOrigin(0.5);

            this.intervalsButtonsList.push({
                'rect': rect,
                'text': text,
                'intervalName': name
            });

            x += buttonWidth;
            if (x > 1600) {
                y += buttonHeight;
                x = buttonWidth / 2;
            }
         }
    }

    intervalChosen(intervalName) {
        this.piano.pressKeys([this.interval.lowNote.noteId, this.interval.highNote.noteId]);
        if (intervalName === this.interval.name_ru)
            this.heading.setText('Правильно!');
        else
            this.heading.setText('Неверно, попробуйте ещё раз!');
        let leftButtons = [];
        for (let button of this.intervalsButtonsList) {
            if (button.text.text === this.interval.name_ru) {
                button.rect.fillColor = 0x00ff44;
                leftButtons.push(button);
            } else if (button.text.text === intervalName) {
                button.rect.fillColor = 0xff5555;
                leftButtons.push(button);
            } else {
                button.rect.destroy();
                button.text.destroy();
            }
        }

        let buttonNext = this.add.rectangle(800, 550, 700, 150, 0x00ee55)
            .setOrigin(0.5);
        let buttonNextText = this.add.text(800, 550, 'Следующий интервал',
            { fontFamily: 'sans-serif', fontSize: 60, color: '#000' })
            .setOrigin(0.5);

        buttonNext.setInteractive();
        buttonNext.on('pointerup', () => {
            leftButtons.forEach(button => {
                button.rect.destroy();
                button.text.destroy();
            });

            buttonNextText.destroy();
            buttonNext.destroy();
            this.piano.clear();

            this.guessRandomInterval();
        })
    }

    drawRepeatButtons() {
        let playTogetherRect = this.add.rectangle(1500, 750, 200, 80, 0x00ee55).
            setOrigin(0.5);
        let playTogetherText = this.add.text(1500, 750, "сыграть\nвместе",
            { fontFamily: 'sans-serif', fontSize: 30, color: '#000', align: 'center' })
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

        let playByOneRect = this.add.rectangle(1500, 850, 200, 80, 0x00ee55).
        setOrigin(0.5);
        let playByOneText = this.add.text(1500, 850, "сыграть\nпо очереди",
            { fontFamily: 'sans-serif', fontSize: 30, color: '#000', align: 'center' })
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

    drawSettingsButton() {
        let settingsRect = this.add.rectangle(1260, 850, 260, 80, 0x00ee55).
        setOrigin(0.5);
        let settingsText = this.add.text(1260, 850, "изменить\nнабор интервалов",
            { fontFamily: 'sans-serif', fontSize: 30, color: '#000', align: 'center' })
            .setOrigin(0.5);

        settingsRect.setInteractive();
        settingsRect.on('pointerup', () => {
            this.changeIntervalsList();
        });
    }

    changeIntervalsList() {
        this.piano.clear();
        this.sound.stopAll();
        this.heading.setText('Выберите интервалы');
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
        if (this.startButton) {
            this.startButton.rect.destroy();
            this.startButton.text.destroy();
        }
        let allIntervals = [[1, 1], [1, 2], [2, 3], [2, 4], [3, 5], [4, 7], [5, 8], [5, 9], [6, 10], [6, 11]];
        this.drawIntervalsButtons(allIntervals);
        for (let button of this.intervalsButtonsList) {
            button.rect.fillColor = 0xff5555;
        }
        for (let interval of this.intervalsList) {
            let intervalName = MusicTheory.getIntervalNameByDifferenceNumbers(interval[0], interval[1]);
            for (let button of this.intervalsButtonsList) {
                if (button.intervalName === intervalName) {
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
                    let name = MusicTheory.getIntervalNameByDifferenceNumbers(interval[0], interval[1]);
                    if (name === button.intervalName) {
                        hasInterval = true;
                        this.intervalsList = this.intervalsList.filter(value => value !== interval);
                        rect.fillColor = 0xff5555;
                    }
                }
                if (!hasInterval) {
                    this.intervalsList.push(MusicTheory.getDifferenceNumbersByIntervalName(button.intervalName));
                    this.intervalsList.sort(function(a, b) {
                        if (a[0] !== b[0]) return a[0] - b[0];
                        else return a[1] - b[1];
                    });
                    rect.fillColor = 0x00ff44;
                }
            });
        }

        let startButton = this.add.rectangle(800, 550, 700, 150, 0x00ee55)
            .setOrigin(0.5);
        let startButtonText = this.add.text(800, 550, 'Начать',
            { fontFamily: 'sans-serif', fontSize: 60, color: '#000' })
            .setOrigin(0.5);

        startButton.setInteractive();
        startButton.on('pointerup', () => {
            startButton.destroy();
            startButtonText.destroy();
            document.cookie = `intervals_list=${this.intervalsList.flat().toString()}`;
            this.guessRandomInterval();
        })
    }
}