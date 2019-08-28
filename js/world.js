block = (n) => n * 32;





class World {
    constructor() {

        this.build = {
            "@": 'spawnpoint',
            "X": 'block',
            "-": 'platform',
            "^": 'elevator.png',
            "v": 'elevator.png',
            "<": 'img/tiles/elevator.png',
            ">": 'img/tiles/elevator.png',
            "M": 'img/tiles/spikes.png',
            "¤": 'img/tiles/cog',
            "#": 'img/tiles/break_block',
        },

            this.tileTemplate = {
                "X": {
                    width: block(1),
                    height: block(1),
                },
                "-": {
                    width: block(1),
                    height: block(.125),
                },
                "^": {
                    width: block(1),
                    height: block(0.1875),
                    range: 64,
                    speed: 1,
                },
                "M": {
                    x: block(1),
                    y: block(2 + .5),
                    width: block(1),
                    height: block(.5),
                },
            }

        this.spawn = {};

        this.tiles = [];
        this.npcs = [];

        this.segments = [];
    }

    loadLevel(lvl) {

        this.width = block(lvl.layout[0].length);
        this.height = block(lvl.layout.length);

        this.tiles = [];
        this.npcs = [];
        this.lightSources = [];

        for (var y = 0; y < lvl.layout.length; y++) {
            for (var x = 0; x < lvl.layout[y].length; x++) {
                var tile = lvl.layout[y][x];
                switch (tile) {
                    case '@': {
                        this.spawn.x = block(x) + 16;
                        this.spawn.y = block(y) + 16;
                        break;
                    }
                    case 'X': {
                        this.tiles.push({
                            x: block(x),
                            y: block(y),
                            width: block(1),
                            height: block(1),
                            type: tile,
                        });
                        break
                    }
                    case '-': {
                        this.tiles.push({
                            x: block(x),
                            y: block(y),
                            width: block(1),
                            height: block(.25),
                            type: tile,
                        });
                        break
                    }
                    case '^': {
                        this.tiles.push({
                            x: block(x),
                            y: block(y),
                            width: block(1),
                            height: block(0.1875),
                            velY: 0,
                            velX: 0,
                            range: 64,
                            speed: 1,
                            type: tile
                        });
                        break;
                    }
                    case 'v': {
                        this.tiles.push({
                            x: block(x),
                            y: block(y),
                            width: block(1),
                            height: block(0.1875),
                            range: 64,
                            speed: 1,
                            type: tile
                        });
                        break;
                    }
                    case '<':
                        this.tiles.push({
                            x: block(x),
                            y: block(y),
                            width: block(1),
                            height: block(0.1875),
                            range: 64,
                            speed: 1,
                            type: tile
                        });
                        break;
                    case '>':
                        this.tiles.push({
                            x: block(x),
                            y: block(y),
                            width: block(1),
                            height: block(0.1875),
                            range: 64,
                            speed: 1,
                            type: tile
                        });
                        break;
                    case 'M':
                        this.tiles.push({
                            x: block(x),
                            y: block(y + .75),
                            width: block(1),
                            height: block(.25),
                            type: tile,
                            drawModifier: () => {
                                render.ctx.translate(0, -block(.25))
                            }
                        });
                        break;
                    case 'W':
                        this.tiles.push({
                            x: block(x),
                            y: block(y),
                            width: block(1),
                            height: block(.25),
                            type: tile
                        });
                        break;
                    case '¤':
                        this.tiles.push({
                            x: block(x),
                            y: block(y),
                            width: block(1),
                            height: block(1),
                            type: tile
                        });
                        break;
                    case '#':
                        this.tiles.push({
                            x: block(x),
                            y: block(y),
                            width: block(1),
                            height: block(1),
                            type: tile
                        });
                    case 'G':
                        this.tiles.push({
                            x: block(x + .25),
                            y: block(y + .25),
                            width: block(.5),
                            height: block(.5),
                            type: tile
                        })
                        break;
                    case 'L': {
                        this.tiles.push({
                            x: block(x + .25),
                            y: block(y),
                            width: block(0),
                            height: block(0),
                            type: tile,
                            light: new Light(block(x + .5), block(y + .1), 0, 455, 460, [{
                                index: 0,
                                color: "#ffc04040"
                            }, {
                                index: 1,
                                color: "#00000000"
                            }])
                        });
                    }
                        break;
                    case 'R':
                        this.npcs.push({
                            x: block(x),
                            y: block(y),
                            width: block(1),
                            height: block(1),
                            velX: 0,
                            frame: 0,
                            type: tile
                        })
                        break;
                }
            }
        }

        lvl.advancedLayer.forEach((tile) => {
            var tile = tile;
            switch (tile.type) {
                case '@': {
                    this.spawn.x = block(tile.x) + 16;
                    this.spawn.y = block(tile.y) + 16;
                    break;
                }
                case 'X': {
                    tile.width = block(1);
                    tile.height = block(1);
                    break;
                }
                case '-': {
                    tile.width = block(1);
                    tile.height = block(.125);
                    break
                }
                case '^': {
                    tile.width = block(1)
                    tile.height = block(0.1875)
                    tile.velY = 0
                    tile.range = 64
                    tile.speed = 1
                    break;
                }
                case 'v': {

                    tile.width = block(1)
                    tile.height = block(0.1875)
                    tile.range = 64
                    tile.speed = 1
                    break;
                }
                case '<': {
                    tile.width = block(1)
                    tile.height = block(0.1875)
                    tile.range = 64
                    tile.speed = 1
                    break;
                }
                case '>': {
                    tile.width = block(1)
                    tile.height = block(0.1875)
                    tile.range = 64
                    tile.speed = 1
                    break;
                }
                case 'M': {
                    tile.y += block(y + .5)
                    tile.width = block(1)
                    tile.height = block(.5)
                    tile.drawModifiers = [
                        render.ctx.translate(0, -.5)
                    ]
                    break;
                }
                case 'W': {
                    tile.width = block(1)
                    tile.height = block(.5)
                    break;
                }
                case '¤': {
                    tile.width = block(1)
                    tile.height = block(1)
                    break;
                }
                case '#': {
                    tile.width = block(1)
                    tile.height = block(1)
                    break;
                }
                case 'G': {
                    tile.x += block(.25)
                    tile.y += block(.25)
                    tile.width = block(.5)
                    tile.height = block(.5)
                    break;
                }
                case 'R': {
                    tile.width = block(1)
                    tile.height = block(1)
                    tile.velX = 0
                    tile.frame = 0
                    break;
                }
            }
            this.tiles.push(tile)
        });

        try {
            lvl.npcs.forEach(npc => this.npcs.push(npc))
        } catch (error) {

        }

        this.segments = this.tiles.filter(tile => tile.type !== "G");
        this.createMesh();


        //this.loadNearby();
    }

    loadNearby() {
        world.tiles.filter((tile) => tile.type == "E").forEach(exit => {
            for (var y = 0; y < lvl.layout.length; y++) {
                for (var x = 0; x < lvl.layout[y].length; x++) {
                    var tile = lvl.layout[y][x];
                    switch (tile) {
                        case '@':
                            break;
                        case 'X': {
                            this.tiles.push({
                                x: block(x),
                                y: block(y),
                                width: block(1),
                                height: block(1),
                                type: tile,
                            });
                            break
                        }
                        case '-': {
                            this.tiles.push({
                                x: block(x),
                                y: block(y),
                                width: block(1),
                                height: block(.125),
                                type: tile
                            });
                            break
                        }
                        case '^': {
                            this.tiles.push({
                                x: block(x),
                                y: block(y),
                                width: block(1),
                                height: block(0.1875),
                                velY: 0,
                                velX: 0,
                                range: 64,
                                speed: 1,
                                type: tile
                            });
                            break;
                        }
                        case 'v': {
                            this.tiles.push({
                                x: block(x),
                                y: block(y),
                                width: block(1),
                                height: block(0.1875),
                                range: 64,
                                speed: 1,
                                type: tile
                            });
                            break;
                        }
                        case '<':
                            this.tiles.push({
                                x: block(x),
                                y: block(y),
                                width: block(1),
                                height: block(0.1875),
                                range: 64,
                                speed: 1,
                                type: tile
                            });
                            break;
                        case '>':
                            this.tiles.push({
                                x: block(x),
                                y: block(y),
                                width: block(1),
                                height: block(0.1875),
                                range: 64,
                                speed: 1,
                                type: tile
                            });
                            break;
                        case 'M':
                            this.tiles.push({
                                x: block(x),
                                y: block(y + .5),
                                width: block(1),
                                height: block(.25),
                                type: tile,
                                drawModifiers: [
                                    render.ctx.translate(0, -.5)
                                ]
                            });
                            break;
                        case 'W':
                            this.tiles.push({
                                x: block(x),
                                y: block(y),
                                width: block(1),
                                height: block(.25),
                                type: tile
                            });
                            break;
                        case '¤':
                            this.tiles.push({
                                x: block(x),
                                y: block(y),
                                width: block(1),
                                height: block(1),
                                type: tile
                            });
                            break;
                        case '#':
                            this.tiles.push({
                                x: block(x),
                                y: block(y),
                                width: block(1),
                                height: block(1),
                                type: tile
                            });
                        case 'G':
                            this.tiles.push({
                                x: block(x + .25),
                                y: block(y + .25),
                                width: block(.5),
                                height: block(.5),
                                type: tile
                            })
                            break;
                        case 'L': {
                            this.tiles.push({
                                x: block(x),
                                y: block(y),
                                width: block(1),
                                height: block(0),
                                type: tile,
                            });
                            this.lightSources.push({
                                x: block(x + .5),
                                y: block(y + .1)
                            });
                        }
                            break;
                        case 'R':
                            this.npcs.push({
                                x: block(x),
                                y: block(y),
                                width: block(1),
                                height: block(1),
                                velX: 0,
                                frame: 0,
                                type: tile
                            })
                            break;
                    }
                }
            }
        })
    }

    update() {
        this.lightSources = [];
        this.tiles.forEach((tile) => {
            switch (tile.type) {
                case '^':

                    tile.velY = -Math.sin((gameClock) / (tile.range / tile.speed)) * tile.speed;
                    //tile.velX = Math.sin((gameClock) / (tile.range / tile.speed)) * tile.speed;
                    tile.y += tile.velY;
                    tile.x += tile.velX;
                    break;
                case 'v':
                    tile.velY = Math.sin((gameClock) / (tile.range / tile.speed)) * tile.speed;
                    tile.y += tile.velY;
                    break;
                case '<':
                    tile.velX = -Math.sin((gameClock) / (tile.range / tile.speed)) * tile.speed;
                    tile.x += tile.velX;
                    break;
                case '>':
                    tile.velX = Math.sin((gameClock) / (tile.range / tile.speed)) * tile.speed;
                    tile.x += tile.velX;
                    break;
                case 'L':
                    this.lightSources.push(tile.light);
                    break;
            }
        })
        this.npcs.forEach(npc => {
            switch (npc.name) {
                case 'spikeGuard':
                    this.lightSources.push(npc.light);
                    break;
            }
            npc.update();

        })
    }

    createMesh() {

        var nSeg = [];

        var last = () => nSeg[nSeg.length - 1];
        this.segments.forEach(tile => {
            if (nSeg.length > 0 && tile.type == last().type && tile.x == (last().x + last().width) && tile.y == last().y) {
                last().width += tile.width;
            } else nSeg.push(tile)
        })

        this.segments = nSeg.sort((a, b) => {
            if (a.x < b.x) return -1;
        });

        nSeg = [];

        this.segments.forEach(seg => {
            if (nSeg.length > 0 && seg.type == last().type && seg.y == (last().y + last().height) && seg.x == last().x && seg.width == last().width) {
                last().height += seg.height;
            } else nSeg.push(seg)
        })

        this.segments = nSeg.sort((a, b) => {
            var returnVal = 0;
            if (a.x < b.x) return -1;
            else if (a.x == b.x) return 0;
            else if (a.x > b.x) return 1;
        })

        this.buildTextures();

    }

    buildTextures() {
        this.segments.filter((seg) => seg.type == "X").forEach(segment => {
            var canvas = document.createElement('canvas')
            canvas.width = segment.width;
            canvas.height = segment.height;
            var ctx = canvas.getContext("2d")
            ctx.imageSmoothingEnabled = false;
            ctx.scale(2, 2);

            var sprite = sprites.tiles[segment.type]
            for (var y = 0; y < segment.height; y += 16) {
                for (var x = 0; x < segment.width; x += 16) {

                    if (segment.width > 32) {

                        if (segment.height > 32) {
                            switch (y) {
                                case 0: {
                                    switch (x) {
                                        case 0: ctx.drawImage(sprite[1], x, y);
                                            break;
                                        case (segment.width / 2) - 16: ctx.drawImage(sprite[3], x, y);
                                            break;
                                        default: ctx.drawImage(sprite[2], x, y);
                                    }
                                    break;
                                }
                                case (segment.height / 2) - 16: {
                                    switch (x) {
                                        case 0: ctx.drawImage(sprite[7], x, y);
                                            break;
                                        case (segment.width / 2) - 16: ctx.drawImage(sprite[9], x, y);
                                            break;
                                        default: ctx.drawImage(sprite[8], x, y);
                                    }
                                    break;
                                }
                                default: {
                                    switch (x) {
                                        case 0: ctx.drawImage(sprite[4], x, y);
                                            break;
                                        case (segment.width / 2) - 16: ctx.drawImage(sprite[6], x, y);
                                            break;
                                        default: ctx.drawImage(sprite[5], x, y);
                                    }
                                    break;
                                }
                            }
                        } else {
                            switch (x) {
                                case 0: ctx.drawImage(sprite[13], x, y);
                                break;
                                case (segment.width / 2) - 16: ctx.drawImage(sprite[15], x, y);
                                break;
                                default: ctx.drawImage(sprite[14], x, y);
                            }
                        }
                    } else if(segment.height > 32) {
                        switch (y) {
                            case 0: ctx.drawImage(sprite[10], x, y);
                            break;
                            case (segment.height / 2) - 16: ctx.drawImage(sprite[12], x, y);
                            break;
                            default: ctx.drawImage(sprite[11], x, y);
                        }
                    } else ctx.drawImage(sprite[0], x, y);
                }
            }
            Promise.all([createImageBitmap(canvas, 0, 0, segment.width, segment.height)]).then((map) => segment.texture = map[0]);
        })
    }

}

class Enemy {
    constructor(posX, posY) {
        this.posX = posX;
        this.posY = posY;
        this.type = "enemies";
    }
}

class Roamer extends Enemy {
    constructor(posX, posY) {
        super(posX + .5, posY + .5);
        this.hp = 3;
        this.velX = -1;

        this.sprite = () => sprites.npcs.enemies.roamer;
    }

    update() {
        if (this.getCollision(world.segments)) this.velX -= this.velX * 2;
        this.posX += this.velX;

        this.getCollisionPlayer()
    }

    getCollision(area, offsetX = 0, offsetY = 0) {
        for (var i = 0; i < area.length; i++) {
            var obj = area[i];
            if (((this.posX - 8) + offsetX) < obj.x + obj.width &&
                ((this.posX + 8) + offsetX) > obj.x &&
                ((this.posY - 16) + offsetY) < obj.y + obj.height &&
                ((this.posY + 8) + offsetY) > obj.y) return true;
        };
        return false;
    }

    getCollisionPlayer(offsetX = 0, offsetY = 0) {
        if (((this.posX - 8) + offsetX) < player.hitbox.x.right() &&
            ((this.posX + 8) + offsetX) > player.hitbox.x.left() &&
            ((this.posY - 16) + offsetY) < player.hitbox.x.bottom() &&
            ((this.posY + 8) + offsetY) > player.hitbox.x.top()) {

            if (player.hitbox.x.bottom() > this.posY - 14) {
                player.velY -= 20;
                this.damage(1);
            } else {
                player.damage(1);
            }
        }
    }

    damage(amount) {
        this.hp -= amount;
        //if(this.hp <= 0) this.kill();
    }

    draw() {
        render.img(this.sprite()[Math.round(this.posX / 2) % this.sprite().length], this.posX - block(.5), this.posY - block(.5), 1, 2);

        if (debug) {
            render.rectStroke(this.posX - 8, this.posY - 8, 16, 24, "#f00");
        }
    }
}
class SpikeGuard extends Enemy {

    constructor(posX, posY) {
        super(posX, posY);
        this.originX = posX;
        this.originY = posY;
        this.velX = 0;
        this.velY = 0;
        this.width = block(1);
        this.height = block(1);
        this.name = "spikeGuard";
        this.acceleration = .3;
        this.deceleration = .9;
        this.detectionRadius = 256;
        this.sprite = () => sprites.npcs.enemies.spikeGuard;
        this.sound = () => sfx.npcs.enemies.spikeGuard;

        this.blink = 0;

        this.light = new Light(this.posX, this.posY, (this.velX * this.detectionRadius), (this.velY * this.detectionRadius), this.detectionRadius, [{
            index: 0,
            color: "#00ffff40"
        }, {
            index: 1,
            color: "#0080ff40"
        }])
    }




    update() {

        this.fromPlayer = Math.sqrt(Math.pow(player.posX - this.posX, 2) + Math.pow(player.posY - this.posY, 2));


        this.fromOrigin = Math.sqrt(Math.pow(this.originX - this.posX, 2) + Math.pow(this.originY - this.posY, 2));

        if (this.fromPlayer < this.detectionRadius) {

            var rotation = Math.atan2(player.posY - this.posY, player.posX - this.posX);
            this.velX += Math.cos(rotation) * this.acceleration
            this.velY += Math.sin(rotation) * this.acceleration

        } else {
            var rotation = Math.atan2(this.originY - this.posY, this.originX - this.posX);
            this.velX += Math.cos(rotation) * this.acceleration
            this.velY += Math.sin(rotation) * this.acceleration

            if (Math.round(this.posX) == this.originX) {

                this.posX = this.originX;
                this.velX /= 2;
            }

            if (Math.round(this.posY) == this.originY) {
                this.posY = this.originY;
                this.velY /= 2;
            }

        }


        this.posX += this.velX;
        this.posY += this.velY;



        this.velX *= this.deceleration;
        this.velY *= this.deceleration;

        if (this.checkCollision()) {
            player.damage(1);
        }

        if (this.blink > 0) this.blink += .25;
        else if ((Math.floor(Math.random() + .005) == 1)) this.blink = 1;

        if (this.blink == (this.sprite().length - 1)) this.blink = 0;
        this.light = new Light(this.posX + (this.velX * 3), this.posY + (this.velY * 3), (this.velX * this.detectionRadius), (this.velY * this.detectionRadius), this.detectionRadius, [{
            index: 0,
            color: "#ffffffff"
        }, {
            index: .005,
            color: "#0095e9ff"
        }, {
            index: .01,
            color: "#0095e980"
        }, {
            index: 1,
            color: "#00000000"
        }])
    }

    checkCollision() {
        if (player.posX < this.posX + 16 &&
            player.posX > this.posX - 16 &&
            player.posY < this.posY + 16 &&
            player.posY > this.posY - 16) return true;
        else return false;
    }

    draw() {

        render.img(this.sprite()[Math.floor(this.blink)], this.posX - (this.width / 2), this.posY - (this.height / 2))


        render.rect((this.posX - 2) + this.velX, (this.posY - 2) + this.velY, 4, 4, "#0095e9");

        if (debug) {
            render.line(this.posX - 16, this.posY, this.posX + 16, this.posY, "#fff");
            render.line(this.posX, this.posY - 16, this.posX, this.posY + 16, "#fff");
        }
    }
}


class LaserTurret extends Enemy {
    constructor(posX, posY) {
        super(posX + block(.5), posY + block(.5))

        this.angle = 0;

        this.sprite = () => sprites.npcs.enemies.laserTurret;
    }

    update() {
        this.angle = Math.atan2(player.posY - this.posY, player.posX - this.posX) * 180 / Math.PI;
    }

    draw() {
        render.img(this.sprite().base, this.posX, this.posY);
        render.img(this.sprite().arm, this.posX, this.posY)

        render.img(this.sprite().laser, this.posX, this.posY, 32, 32, this.posX, this.posY, this.angle + 180);
    }
}

class Bogus extends Enemy {
    constructor(posX, posY) {
        super(posX, posY);
        this.sprite = () => sprites.npcs.bogus;
    }

    update() {

    }

    draw() {
        render.img(this.sprite().idle[Math.round(gameClock / 8) % this.sprite().idle.length], this.posX, this.posY);
    }
}


const level = [
    {
        name: "The Well",
        layout: [
            "XXXXX--XXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXX  XXXXXXXXXXXXXXXXXXXXXXXXX",
            "X          XXXXXXXXXXXXXXXXXXXXX",
            "X          XXXXXXXXXXXXXXXXXXXXX",
            "X    --    XXXXXXXXXXXXXXXXXXXXX",
            "X          XXXXXXXXXXXXXXXXXXXXX",
            "X          XXXXXXXXXXXXXXXXXXXXX",
            "X--        XXXXXXXXXXXXXXXXXXXXX",
            "X          XXXXXXXXXXXXXXXXXXXXX",
            "X          XXXXXXXXXXXXXXXXXXXXX",
            "X       ---XXXXXXXXXXXXXXXXXXXXX",
            "X          XXXXXXXXXXXXXXXXXXXXX",
            "X---       XXXXXXXXXXXXXXXXXXXXX",
            "X          XXXXXXXXXXXXXXXXXXXXX",
            "X    --    XXXXXXXXXXXXXXXXXXXXX",
            "X          XXXXXXXXXXXXXXXXXXXXX",
            "X        --XXXXXXXXXXXXXXXXXXXXX",
            "X          XXXXXXXXXXXXXXXXXXXXX",
            "X--        XXXXXXXXXXXXXXXXXXXXX",
            "X          XXXXXXXXXXXXXXXXXXXXX",
            "X          XXXXXXXXXXXXXXXXXXXXX",
            "X    --    XX        XXXXXXXXXXX",
            "X          XX  XXXX  XXXXXXXXXXX",
            "X          XX  XXXX            X",
            "X          XX  XXXXXXXXX    @  X",
            "X       ---XX  XXXXXXXXX       X",
            "X          XX  XXXXXXXXXXXXXXXXX",
            "X          XX  XXXXXXXXXXXXXXXXX",
            "X---       XX  XXXXXXXXXXXXXXXXX",
            "X              XXXXXXXXXXXXXXXXX",
            "X              XXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
        ],
        advancedLayer: [
            {
                type: "E",
                x: block(5),
                y: block(0),
                width: block(2),
                height: block(.1),
                entry: block(1),
                exit: 1,
                exitX: block(6),
                exitY: block(30),
            },
        ],
        npcs: [
            //new SpikeGuard(block(3), block(15)),
        ]
    }, {
        name: "Toybox",
        layout: [
            "X                    G                 G                               X",
            "X                                                                      X",
            "X                                                        XXXXXX        X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "XXXXXXXXXX                   XXX                      G                X",
            "X        X                    L                                        X",
            "X                                                                      X",
            "X     vv                                                               X",
            "X        XXXXXXXXXXXXXX                                                X",
            "X        X            X                        G                       X",
            "X    MMMMX            X                                                X",
            "X    XXXXX                                                             X",
            "X                                                                      X",
            "X                                                                      X",
            "XXXXXXXXXXXXXMMMMMMXXXX      XXXXXXXXXXX                     XXX-------X",
            "XXXXXXXXXXXXXXXXXXXXXXX        G     G                        G        X",
            "X              L    X                                                  X",
            "X                   X                                                  X",
            "X                   X  ^^vv                                            X",
            "X     vv                                                               X",
            "X        -X-                                                           X",
            "X         X                                                            X",
            "X         X  >>     XXXMMMMXXX                     XXX                 X",
            "X         X         XXXXXXXXXX---   ---X                               X",
            "X         X         XXXXXXXXXX         X     XX                        X",
            "X         X         X        X         X     XX                        X",
            "X                   X        X         X     XX                        X",
            "X  ^^               X    @   X   ---   X                               X",
            "                        XX                                              ",
            "                       XXXX                                             ",
            "XXXXX--XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXX  XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
        ],
        advancedLayer: [
            {
                type: "E",
                x: block(0),
                y: block(30),
                width: block(0),
                height: block(2),
                entry: block(1),
                exit: 2,
                exitX: block(81.5),
                exitY: block(9.5),
            }, {
                type: "E",
                x: block(72),
                y: block(30),
                width: block(0),
                height: block(2),
                entry: block(1),
                exit: 3,
                exitX: block(.5),
                exitY: block(10.5),
            }
        ],
        npcs: [
            //new Bogus(30, 29), //block(20), block(20)),
            // new LaserTurret(block(20), block(31)),
            //new Roamer(30, 31)
        ]
    }, {
        name: "GA valley",
        layout: [
            "X                                                                                X",
            "X                                                                                X",
            "X                                                                                X",
            "X                                                                                X",
            "X                                                                                X",
            "X                                                                                X",
            "X                                                                                X",
            "X                                                                                X",
            "X                                                                                 ",
            "X                                                                                 ",
            "X                             X----XXXX  >>        <<  XXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "X                             X    XXXX                XXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "X                             X    XXXXMMMMMMMMMMMMMMMMXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "X                             X----XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "X                                  XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "X        @                         XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXX    XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXX    XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
        ],
        advancedLayer: [
            {
                type: "E",
                x: block(81.99),
                y: block(8),
                width: block(0),
                height: block(2),
                entry: block(1),
                exit: 1,
                exitX: block(.5),
                exitY: block(31.5),
            }
        ]
    }, {
        name: "MNKO Swinging Course - Hall",
        layout: [
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "X                               XXX                                                             XXX",
            "X                               XXX                                                             XXX",
            "X            G                  XXX                                                             XXX",
            "X                               XXX                G                                            XXX",
            "X                               XXX                                                             XXX",
            "X                               XXX                                                 XXXXXXXXX   XXX",
            "X                               XXX                                                 XXXWWWWG    XXX",
            "X                               XXX                                                 XXX         XXX",
            "                       XXXXXX   XXX                            G            G       XXX         XXX",
            "  @                    XXXXXX   XXX   XXXXXX                                        XXX         XXX",
            "XXXX                   XXXXXX    G    XXXXXX                                        XXX         XXX",
            "XXXX                   XXXXXX         XXXXXX                                        XXX   MMMMMMXXX",
            "XXXX                   XXXXXX         XXXXXX                                        XXX   XXXXXXXXX",
            "XXXX                   XXXXXX         XXXXXX                                        XXX           X",
            "XXXX                   XXXXXX         XXXXXX                                        XXX            ",
            "XXXX                   XXXXXX         XXXXXX                                        XXX            ",
            "XXXX                   XXXXXX         XXXXXX                                        XXXXXXXXXXXXXXX",
        ],
        advancedLayer: [
            {
                type: "E",
                x: block(0),
                y: block(10),
                width: block(0),
                height: block(2),
                exit: 1,
                exitX: block(71.5),
                exitY: block(31.5),
            }, {
                type: "E",
                x: block(99),
                y: block(15),
                width: block(0),
                height: block(2),
                exit: 4,
                exitX: block(.5),
                exitY: block(31.5)
            }
        ]
    }, {
        name: "MNKO Swinging Course - Tower",
        layout: [
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXX                  XXXXXXX",
            "XXXXXXX                  XXXXXXX",
            "XXXXXXX                  XXXXXXX",
            "XXXXXXX                  XXXXXXX",
            "XXXXXXX                  XXXXXXX",
            "XXXXXXX                  XXXXXXX",
            "XXXXXXX         XXXXXXXXXXXXXXXX",
            "XXXXXXX      -XXX        XXXXXXX",
            "XXXXXXX                  XXXXXXX",
            "XXXXXXX                  XXXXXXX",
            "XXXXXXXXXXXXXXXXXXXXX    XXXXXXX",
            "XXXXXXXXXXXXXXXXXWWWG    XXXXXXX",
            "XXXXXXXXXXXXXXXXX        XXXXXXX",
            "XXXXXXXXXXXXXXXXX        XXXXXXX",
            "XXXXXXXXXXXXXXXXX        XXXXXXX",
            "XXXXXXXXXXXXXXXXX    MMMMXXXXXXX",
            "XXXXXXXXXXXXXXXXX    XXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXX    GWWWXXXXXXX",
            "XXXXXXXXXXXXXXXXX        XXXXXXX",
            "XXXXXXXXXXXXXXXXX        XXXXXXX",
            "XXXXXXXXXXXXXXXXX        XXXXXXX",
            "XXXXXXXXXXXXXXXXXMMMM    XXXXXXX",
            "XXXXXXXXXXXXXXXXXXXXX    XXXXXXX",
            "XXXXXXXWWWWWWWWWWWWWW    XXXXXXX",
            "XXXXXXX          G       XXXXXXX",
            "XXXXXXX                  XXXXXXX",
            "XXXXXXX                  XXXXXXX",
            "XXXXXXX                  XXXXXXX",
            "X                        XXXXXXX",
            "                         XXXXXXX",
            "        @                XXXXXXX",
            "XXXXXXX---               XXXXXXX",
            "XXXXXXX                  XXXXXXX",
            "XXXXXXXMMMMMMMMMMMMMMMMMMXXXXXXX",
        ],
        advancedLayer: [{
            type: "E",
            x: block(0),
            y: block(30),
            width: block(0),
            height: block(2),
            exit: 3,
            exitX: block(98.5),
            exitY: block(16.5)
        }

        ],
        npcs: [
            new SpikeGuard(block(10), block(10)),
        ]
    }, {
        name: "Mryo Worl",
        layout: [
            "                                          ",
            "                                          ",
            "                                          ",
            "                                          ",
            "                                          ",
            "                                          ",
            "                                          ",
            "                                          ",
            "                                          ",
            "                                          ",
            "                                       X X",
            "                   -----------------      ",
            "                                          ",
            " @               -                        ",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
        ],
        advancedLayer: []
    }, {
        name: "Adv Layer Testing",
        layout: [
            "X                  X",
            "X                  X",
            "X                  X",
            "X                  X",
            "X                  X",
            "X                  X",
            "X                  X",
            "X                  X",
            "X                  X",
            "X                  X",
            "X                  X",
            "X                  X",
            "X                  X",
            "X                  X",
            "X            X     X",
            "X GX         X  G  X",
            "X            X     X",
            "X         @  X     X",
            "XXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXX",
        ],
        advancedLayer: [],
    }, {
        name: "Light Test",
        layout: [
            "                                                                                      ",
            "                                          L                                           ",
            "                                                                                      ",
            "                                                                                      ",
            "                                                                                      ",
            "                                                                                      ",
            "                                                                                      ",
            "                                                                                      ",
            "                                                                                      ",
            "                                                                                      ",
            "                                                                                      ",
            "                                      ---------------                                 ",
            "                                                                                      ",
            "                                                                                      ",
            "                                      ---------------                                 ",
            " @                                                                                    ",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
        ],
        advancedLayer: []
    }];