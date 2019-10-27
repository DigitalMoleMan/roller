class Tile {
    constructor(type, x, y, width, height, style = '') {
        this.type = type;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.style = style
        this.sprite = () => sprites.tiles[this.type]
    }

    update() {
    }

    draw() {
        render.img(this.sprite(), this.x, this.y);
    }
}

class Block extends Tile {
    constructor(x, y, style = 'metal') {
        super('block', x, y, 32, 32, style);
    }

    draw() {
        render.img(this.sprite, this.x, this.y);
    }
}

class Platform extends Tile {
    constructor(x, y) {
        super('platform', x, y, 32, 8);
    }
}

class Elevator extends Tile {
    constructor(x, y, speedH, speedV, range) {
        super('elevator', x, y, 32, 8);
        this.velX = 0;
        this.velY = 0;
        this.speedH = speedH;
        this.speedV = speedV;
        this.range = range;
    }

    update() {
        if (this.speedH !== 0) this.velX = -Math.sin((gameClock) / (this.range / this.speedH)) * this.speedH;
        if (this.speedV !== 0) this.velY = -Math.sin((gameClock) / (this.range / this.speedV)) * this.speedV;
        this.x += this.velX;
        this.y += this.velY;


    }
}

class Hookpoint extends Tile {
    constructor(x, y){
        super('hookpoint', x + block(.25), y + block(.25), block(.5), block(.5))
    }
}