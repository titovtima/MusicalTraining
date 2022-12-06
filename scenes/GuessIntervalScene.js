class GuessIntervalScene extends Phaser.Scene {

    preload() {
        for (let i = 0; i < 24; i++)
            this.load.audio('note_' + i, 'sounds/' + i + '.mp3');
    }

    create() {
        this.add.text(800, 100, "Какой интервал звучит?",
            { fontFamily: 'sans-serif', fontSize: 80, color: '#000' }).setOrigin(0.5, 0);

        this.piano = new Piano(this, 100, 600, 300, 100);
        this.piano.draw();

        // piano.pressKeys([12, 15, 19, 22]);
        // setTimeout(() => { piano.unpressKeys([12, 15, 19, 22]); }, 3000);

        this.guessRandomInterval();
    }

    guessRandomInterval() {
        let lowNote = MusicTheory.createRandomNoteWithOctave();
        let interval = MusicTheory.createRandomIntervalFromList(lowNote, [[1, 1], [1, 2], [2, 3], [2, 4]]);
        console.log(interval.name_ru);

        let lowNoteId = lowNote.noteId % 24
        let highNoteId = interval.highNote.noteId % 24;

        if (lowNoteId > highNoteId) {
            lowNoteId -= 12;
            highNoteId += 12;
        }

        this.sound.play('note_' + lowNoteId);
        this.sound.play('note_' + highNoteId);

        this.piano.pressKeys([lowNoteId, highNoteId]);
    }
}