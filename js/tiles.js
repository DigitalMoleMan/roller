class Tile {
    constructor(type, x, y, width, height, style = '') {
        this.type = type;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.style = style;
        this.sprite = () => sprites.tiles[this.type];
    }

    update() {
    }

    draw() {
        render.img(this.sprite(), this.x, this.y);
    }
}

class Barrier extends Tile {
    constructor(x, y, width, height) {
        super('barrier', x, y, width, height);
    }

    draw() {

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
        if (this.speedH !== 0) this.velX = (-Math.sin(Math.round(gameClock) / (this.range / this.speedH)) * this.speedH);
        if (this.speedV !== 0) this.velY = (-Math.sin(Math.round(gameClock) / (this.range / this.speedV)) * this.speedV);
        this.x += this.velX * deltaTime;
        this.y += this.velY * deltaTime;


    }

    draw() {
        render.img(this.sprite()[Math.floor((gameClock) % this.sprite().length)], this.x, this.y, 1)
    }
}

class Hookpoint extends Tile {
    constructor(x, y) {
        super('hookpoint', x + block(.25), y + block(.25), block(.5), block(.5))
    }
}

class Spikes extends Tile {
    constructor(x, y, orientation = 'up', style = 'metal') {
        if (orientation == 'up') y += block(.75);
        super('spikes', x, y, 32, 8, `${style}_${orientation}`)
        this.orientation = orientation;
        this.sprite = () => sprites.tiles[this.type][this.style]
    }

    draw() {
        if (this.orientation == 'up') render.img(this.sprite(), this.x, this.y - block(.25));
        else render.img(this.sprite(), this.x, this.y);
    }
}

class Pumpkin extends Tile {
    constructor(x, y) {
        super('pumpkin', x, y, 32, 32);
    }

    draw() {
        if (!hwQuest.started) render.img(this.sprite(), this.x, this.y);
    }
}

var candyStatus = {}
class Candy extends Tile {
    constructor(x, y) {
        super('candy', x + 4, y, 24, 24)

        this.candyId = x + '' + y

        this.collected = candyStatus[this.candyId];
        if (this.collected == undefined) {
            this.collected = false;
            candyStatus[this.candyId] = this.collected;
        }



        this.sfx = () => sfx.tiles.candy.collect;
    }

    update() {
        if (!this.collected) {
            this.y += (Math.cos((gameClock) / (4 / .3)) * .3);



            if (gameClock % 5 == 0) render.pe.addParticle({
                x: this.x + (this.width / 2) + ((Math.random() - .5) * 16),
                y: this.y + (this.height / 2) + ((Math.random() - .5) * 16),
                velX: ((Math.random() - .5) * .1),
                velY: ((Math.random() - .5) * .1),
                lifetime: (Math.random() * 40),
                size: (Math.random() * 2),
                color: `rgba(255,255,128,64)`
            })
        }
    }

    collect() {
        if (!this.collected) {
            playSound(this.sfx());
            hwQuest.candiesCollected++;
            this.collected = true;

            candyStatus[this.candyId] = this.collected;
        }
    }

    draw() {
        if (!this.collected) render.img(this.sprite(), this.x, this.y);
    }
}