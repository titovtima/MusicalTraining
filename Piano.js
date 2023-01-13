class Piano {
    constructor(scene, x, y, height, keyWidth) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.height = height;
        this.keyWidth = keyWidth;
    }

    draw() {
        this.graphics = this.scene.add.graphics({ lineStyle: { width: 2, color: 0x0 }, fillStyle: { color: 0xffffff } });
        for (let i = 0; i < 14; i++) {
            let rect = new Phaser.Geom.Rectangle(this.x + i * this.keyWidth, this.y, this.keyWidth, this.height);
            this.graphics.fillRectShape(rect);
            this.graphics.strokeRectShape(rect);
        }
        this.graphics.fillStyle(0x0);
        for (let i = 0; i < 14; i++) {
            if (i % 7 === 0 || i % 7 === 3) continue;
            let rect = new Phaser.Geom.Rectangle(this.x + i * this.keyWidth - this.keyWidth / 3, this.y,
                this.keyWidth * 2 / 3, this.height * 4 / 7);
            this.graphics.fillRectShape(rect);
        }
    }

    keyIdToRect(id) {
        if (id < 0 || id > 23) return null;
        let octave = 0;
        if (id > 11) {
            octave = (id - id % 12) / 12;
            id = id % 12;
        }
        let rect;
        if (id === 0 || id === 2 || id === 4)
            rect = new Phaser.Geom.Rectangle(this.x + id * this.keyWidth / 2 + 1,
                this.y + this.height * 4 / 7 + 1, this.keyWidth - 2, this.height * 3 / 7 - 2);
        if (id === 1 || id === 3)
            rect = new Phaser.Geom.Rectangle(this.x + (id - 1) * this.keyWidth / 2 + this.keyWidth * 2 / 3 + 1,
                this.y + 1, this.keyWidth * 2 / 3 - 2, this.height * 4 / 7 - 2);
        if (id === 5 || id === 7 || id === 9 || id === 11)
            rect = new Phaser.Geom.Rectangle(this.x + (id + 1) * this.keyWidth / 2 + 1,
                this.y + this.height * 4 / 7 + 1, this.keyWidth - 2, this.height * 3 / 7 - 2);
        if (id === 6 || id === 8 || id === 10)
            rect = new Phaser.Geom.Rectangle(this.x + id * this.keyWidth / 2 + this.keyWidth * 2 / 3 + 1,
                this.y + 1, this.keyWidth * 2 / 3 - 2, this.height * 4 / 7 - 2);
        return new Phaser.Geom.Rectangle(rect.x + octave * this.keyWidth * 7, rect.y, rect.width, rect.height);
    }

    isKeyBlack(id) {
        if (id < 0 || id > 23) return null;
        return id === 1 || id === 3 || id === 6 || id === 8 || id === 10 ||
            id === 13 || id === 15 || id === 18 || id === 20 || id === 22;
    }

    pressKey(id) {
        let keyRect = this.keyIdToRect(id);
        let padding = this.keyWidth / 10 - 1;
        let drawRect = new Phaser.Geom.Rectangle(keyRect.x + padding, keyRect.y + padding,
            keyRect.width - padding * 2, keyRect.height - padding * 2);
        this.graphics.fillStyle(0xff0000);
        this.graphics.fillRectShape(drawRect);
    }

    pressKeys(keys) {
        for (let key of keys)
            this.pressKey(key);
    }

    unpressKey(id) {
        let keyRect = this.keyIdToRect(id);
        this.graphics.lineStyle({ width: 1, color: 0x0 });
        this.graphics.fillStyle(0xffffff);
        if (this.isKeyBlack(id))
            this.graphics.fillStyle(0x0);
        this.graphics.fillRectShape(keyRect);
    }

    unpressKeys(keys) {
        for (let key of keys)
            this.unpressKey(key);
    }

    clear() {
        for (let id = 0; id < 24; id++)
            this.unpressKey(id);
    }

    setVisibility(visibility) {
        this.graphics.setVisible(visibility);
    }
}