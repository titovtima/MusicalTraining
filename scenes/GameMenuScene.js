class GameMenuScene extends Phaser.Scene {

    constructor() {
        super(GAME_SCENES_KEYS.GameMenu);
    }

    preload() {
        this.load.json('gamesInfo', 'jsonConfig/games.json');
        this.load.image('menuCardBackground', RESOURCES_PATH + 'rec800-500.png');
    }

    create() {
        this.drawTitle();
        this.drawGamesButtons();
    }

    drawTitle() {
        this.add.text(800, 75, 'Выберите игру',
            { fontFamily: 'sans-serif', fontSize: 100, color: '#000' })
            .setOrigin(0.5);
    }

    drawGamesButtons() {
        let gamesInfo = this.cache.json.get('gamesInfo');

        let buttonWidth = 1600 / 4;
        let buttonHeight = 250;
        let imgScale = 0.45;

        let buttonX = buttonWidth / 2;
        let buttonY = 150 + buttonHeight / 2 ;

        for (let game of gamesInfo.games) {
            let background = this.add.image(buttonX, buttonY, 'menuCardBackground')
                .setScale(imgScale).setOrigin(0.5);
            let text = this.add.text(buttonX, buttonY, game.name_ru,
                { fontFamily: 'sans-serif', fontSize: 40, color: '#000', align: 'center' })
                .setOrigin(0.5);

            background.setInteractive();
            background.on('pointerup', () => {
                // ym(91864844,'reachGoal','start_level');
                // let jsonString = `{ "start_level_${level.index}": 1 }`;
                // ym(91864844, 'params', JSON.parse(jsonString));

                GAME_DATA.game = game;
                this.scene.start(GAME_SCENES_KEYS.LevelMenu);
            });

            buttonX += buttonWidth;
            if (buttonX > 1600) {
                buttonX = buttonWidth / 2;
                buttonY += buttonHeight;
            }
        }
    }
}
