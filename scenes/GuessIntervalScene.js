class GuessIntervalScene extends Phaser.Scene {

    preload() {
        for (let i = 0; i < 24; i++)
            this.load.audio('note_' + i, 'sounds/' + i + '.mp3');
    }

    create() {
        this.heading = this.add.text(800, 100, "Какой интервал звучит?",
            { fontFamily: 'sans-serif', fontSize: 80, color: '#000' }).setOrigin(0.5, 0);

        this.piano = new Piano(this, 100, 600, 300, 100);
        this.piano.draw();

        this.intervalsList = [[1, 1], [1, 2], [2, 3], [2, 4]];

        this.guessRandomInterval();
    }

    guessRandomInterval() {
        this.sound.stopAll();
        let notesList = [[0,0], [0,1], [1, 1], [1, 2], [1, 3], [2, 3], [2, 4],
            [3, 5], [3, 6], [4, 6], [4, 7], [4, 8], [5, 8], [5, 9], [5, 10], [6, 10], [6, 11]];
        let lowNoteNumber = Math.floor(Math.random() * notesList.length);
        let lowNote = MusicTheory.createNoteWithOctave(notesList[lowNoteNumber][0], notesList[lowNoteNumber][1]);
        let intervalNumber = Math.floor(Math.random() * this.intervalsList.length)
        let naturalsDiff = this.intervalsList[intervalNumber][0];
        let idsDiff = this.intervalsList[intervalNumber][1];
        this.interval = MusicTheory.createIntervalByNoteAndDiffs(lowNote, naturalsDiff, idsDiff);
        console.log(this.interval.name_ru);

        let highNoteId = this.interval.highNote.noteId;

        if (highNoteId < 12) {
            if (Math.random() < 0.5) {
                lowNote = MusicTheory.createNoteWithOctave(lowNote.noteId + 12, lowNote.natural + 7);
                this.interval = MusicTheory.createIntervalByNoteAndDiffs(lowNote, naturalsDiff, idsDiff);
                highNoteId += 12
            }
        }
        let lowNoteId = lowNote.noteId;

        let lowNoteSound = this.sound.add('note_' + lowNoteId);
        let highNoteSound = this.sound.add('note_' + highNoteId);
        // this.sound.play('note_' + highNoteId);
        lowNoteSound.play();
        highNoteSound.play();

        this.drawButtonsToGuess();
        // this.piano.pressKeys([lowNoteId, highNoteId]);
    }

    drawButtonsToGuess() {
        let buttonWidth = 1600 / 6;
        let buttonHeight = 100;
        let x = buttonWidth / 2;
        let y = 200 + buttonHeight / 2;
        this.intervalsButtonsList = [];
        for (let interval of this.intervalsList) {
            let rect = this.add.rectangle(x, y, buttonWidth - 20, buttonHeight - 20, 0x00ffff)
                .setOrigin(0.5);

            let name = MusicTheory.getIntervalNameByDifferenceNumbers(interval[0], interval[1]);
            let text = this.add.text(x, y, name, { fontFamily: 'sans-serif', fontSize: 25, color: '#000' })
                .setOrigin(0.5);

            this.intervalsButtonsList.push({
                'rect': rect,
                'text': text
            });

            rect.setInteractive();
            rect.on('pointerup', () => {
                this.intervalChosen(name);
            })

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

        // let intervalName = this.add.text(800, 580, interval.name_ru,
        //     { fontFamily: 'sans-serif', fontSize: 50, color: '#000' })
        //     .setOrigin(0.5, 1);

        let buttonNext = this.add.rectangle(800, 450, 600, 200, 0x00ee55)
            .setOrigin(0.5);
        let buttonNextText = this.add.text(800, 450, 'Следующий интервал',
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
}