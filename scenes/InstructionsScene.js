class InstructionsScene extends Phaser.Scene {
    constructor() {
        super(GAME_SCENES_KEYS.Instructions);
    }

    preload() {
        this.load.image('semitones', RESOURCES_PATH + 'semitones.jpg');
    }

    create() {
        this.page = 0;
        this.drawMenuButton();
        this.drawInstructions();
    }

    drawMenuButton() {
        let rect = this.add.rectangle(1480, 70, 200, 100, 0x00ee55)
            .setOrigin(0.5);
        this.add.text(1480, 70, 'Меню',
            { fontFamily: 'sans-serif', fontSize: 60, color: '#000' })
            .setOrigin(0.5);

        rect.setInteractive();
        rect.on('pointerup', () => {
            this.scene.start(GAME_SCENES_KEYS.Menu);
        });
    }

    drawInstructions() {
        if (this.page === 0) {
            this.drawFirstPage();
        }
    }

    drawFirstPage() {
        let text1 = 'Интервал в музыке - сочетание двух нот. Название интервала показывает расстояние между нотами. ' +
            'Расстояния в музыке измеряются в тонах. Один лад на гитаре - полтона. ' +
            'Между любыми двумя соседними клавишами на пианино (между которыми нет другой клавиши) - полтона. ' +
            'Полутона на пианино:';
        let block1 = this.add.text(800, 130, text1,
            { fontFamily: 'sans-serif', fontSize: 35, color: '#000',
                align: 'center', wordWrap: { width: 1500 } })
            .setOrigin(0.5, 0);
        let block2 = this.add.image(800, 300, 'semitones')
            .setOrigin(0.5, 0)
            .setScale(222/181);
        let text3 = 'В игре предлагается угадать по звучанию,\nкакое расстояние в тонах между звучащими нотами.\n' +
            'Соответствие названий интервалов расстоянию в тонах:';
        let block3 = this.add.text(800, 525, text3,
            { fontFamily: 'sans-serif', fontSize: 35, color: '#000',
                align: 'center' })
            .setOrigin(0.5, 0);
        let text4 = '0,5 тона - малая секунда\n' +
            '1 тон - большая секунда\n' +
            '1,5 тона - малая терция\n' +
            '2 тона - большая терция\n' +
            '2,5 тона - чистая кварта\n' +
            '3 тона - тритон\n';
        let block4 = this.add.text(400, 650, text4,
            { fontFamily: 'sans-serif', fontSize: 35, color: '#000',
                align: 'center', wordWrap: { width: 1500 } })
            .setOrigin(0.5, 0);
        let text5 = '3,5 тона - чистая квинта\n' +
            '4 тона - малая секста\n' +
            '4,5 тона - большая секста\n' +
            '5 тонов - малая септима\n' +
            '5,5 тонов - большая септима\n' +
            '6 тонов - октава\n';
        let block5 = this.add.text(1200, 650, text5,
            { fontFamily: 'sans-serif', fontSize: 35, color: '#000',
                align: 'center', wordWrap: { width: 1500 } })
            .setOrigin(0.5, 0);
        this.displayBlocks = [block1, block2, block3, block4, block5];
    }
}