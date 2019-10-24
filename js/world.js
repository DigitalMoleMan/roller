block = (n) => n * 32;

class World {
    constructor() {

        this.spawn = {};

        this.tiles = [];
        this.npcs = [];

        this.segments = [];

        document.addEventListener(input.binds.game.interact, () => {
            if (activeScene == "game") this.interaction();
        })

    }

    interaction() {
        let inRangeActors = this.npcs.filter((npc) => (
            //npc.type == "actor" &&
            player.posX > (npc.posX) &&
            player.posX < (npc.posX + npc.interactionRadius) &&
            player.posY > (npc.posY) &&
            player.posY < (npc.posY + npc.interactionRadius)));
        console.log(inRangeActors);
        if (inRangeActors.length > 0) inRangeActors[0].onInteract();
    }

    loadLevel(lvl) {

        this.width = block(lvl.layout[0].length);
        this.height = block(lvl.layout.length);

        this.tiles = [];
        this.npcs = [];
        this.lightSources = [];

        for (let y = 0; y < lvl.layout.length; y++) {
            for (let x = 0; x < lvl.layout[y].length; x++) {
                let tile = lvl.layout[y][x];
                switch (tile) {
                    case '@': {
                        this.spawn.x = block(x) + 16;
                        this.spawn.y = block(y) + 16;
                        break;
                    }
                    case 'X': {
                        this.tiles.push(new Block(block(x), block(y), 'metal'));
                        break
                    }
                    case 'D': {
                        this.tiles.push(new Block(block(x), block(y), 'dirt'));
                        break
                    }
                    case '-': {
                        this.tiles.push(new Platform(block(x), block(y)));
                        break
                    }
                    case '^': {
                        this.tiles.push(new Elevator(block(x), block(y), 0, 1, 64));
                        break;
                    }
                    case 'v': {
                        this.tiles.push(new Elevator(block(x), block(y), 0, 1, -64));
                        break;
                    }
                    case '<':
                        this.tiles.push(new Elevator(block(x), block(y), 1, 0, 64));
                        break;
                    case '>':
                        this.tiles.push(new Elevator(block(x), block(y), 1, 0, -64));
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
                        this.tiles.push(new Hookpoint(block(x),block(y)));
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

        for (let tile of lvl.advancedLayer) {
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
        };

        this.npcs = lvl.npcs


        this.segments = this.tiles.filter(tile => tile.type !== "G");
        this.createMesh();

        this.tiles = this.tiles.filter((tile) => tile.type !== 'block');


        //this.loadNearby();
    }

    update() {
        this.lightSources = [];
        for (let tile of this.tiles) {
            try {
                tile.update()
            } catch{ }
            switch (tile.type) {
                case 'L':
                    this.lightSources.push(tile.light);
                    break;
            }
        }


        for (let npc of this.npcs) {
            switch (npc.name) {
                case 'spikeGuard':
                    this.lightSources.push(npc.light);
                    break;
            }
            npc.update();
        }


    }

    createMesh() {

        var nSeg = [];

        var last = () => nSeg[nSeg.length - 1];
        for (let tile of this.segments) {
            if (nSeg.length > 0
                && (tile.type + tile.style) === (last().type + last().style)
                && tile.x == (last().x + last().width)
                && tile.y == last().y
                && tile.type !== "elevator") {
                last().width += tile.width;
            } else nSeg.push(tile)
        }

        this.segments = nSeg.sort((a, b) => {
            if (a.x < b.x) return -1;
        });

        nSeg = [];

        for (let seg of this.segments) {
            if (nSeg.length > 0
                && (seg.type + seg.style) === (last().type + last().style)
                && seg.y == (last().y + last().height)
                && seg.x == last().x
                && seg.width == last().width) {
                last().height += seg.height;
            } else nSeg.push(seg)
        }

        this.segments = nSeg.sort((a, b) => {
            var returnVal = 0;
            if (a.x < b.x) return -1;
            else if (a.x == b.x) return 0;
            else if (a.x > b.x) return 1;
        })

        this.buildTextures();

    }

    buildTextures() {

        for (let segment of this.segments.filter((seg) => seg.type == 'block')) {
            let canvas = document.createElement('canvas')
            canvas.width = segment.width;
            canvas.height = segment.height;
            let ctx = canvas.getContext("2d")
            ctx.imageSmoothingEnabled = false;
            ctx.scale(2, 2);
            let spritePath = `${segment.type}_${segment.style}`;
            let sprite = sprites.tiles[spritePath]
            let alteration = sprites.tiles['alt_' + spritePath]
            for (let y = 0; y < segment.height; y += 16) {
                for (let x = 0; x < segment.width; x += 16) {
                    let dIndex = 0;
                    if (segment.width > 32) {
                        if (segment.height > 32) switch (y) {
                            case 0: switch (x) {
                                case 0: dIndex = 1; break;
                                case (segment.width / 2) - 16: dIndex = 3; break;
                                default: dIndex = 2;
                            } break;
                            case (segment.height / 2) - 16: switch (x) {
                                case 0: dIndex = 7; break;
                                case (segment.width / 2) - 16: dIndex = 9; break;
                                default: dIndex = 8;
                            } break;
                            default: switch (x) {
                                case 0: dIndex = 4; break;
                                case (segment.width / 2) - 16: dIndex = 6; break;
                                default: dIndex = 5
                            } break;
                        } else switch (x) {
                            case 0: dIndex = 13; break;
                            case (segment.width / 2) - 16: dIndex = 15; break;
                            default: dIndex = 14;
                        }
                    } else if (segment.height > 32) switch (y) {
                        case 0: dIndex = 10; break;
                        case (segment.height / 2) - 16: dIndex = 12; break;
                        default: dIndex = 11;
                    } else dIndex = 0;

                    if (segment.width > 32 && x == 0 && segment.x == 0) dIndex++
                    if (segment.width > 32 && x == (segment.width / 2) - 16 && (segment.x + segment.width) == world.width) dIndex--;
                    if (segment.height > 32 && y == 0 && segment.y == 0) dIndex += 3;
                    if (segment.height > 32 && y == (segment.height / 2) - 16 && segment.y + segment.height == world.height) dIndex -= 3;

                    ctx.drawImage(sprite[dIndex], x, y);
                    try {
                        if ((Math.random() * 10) < 1) ctx.drawImage(alteration[dIndex], x, y);
                    } catch { }
                }
            }
            try {
                Promise.all([createImageBitmap(canvas, 0, 0, segment.width, segment.height)]).then((map) => segment.sprite = map[0]);
            } catch {
                segment.sprite = new Image();
                segment.sprite.src = canvas.toDataURL();
            }
        }
    }

}

class Actor {
    constructor(posX, posY, onInteract, interactionRadius) {
        this.type = "actor";
        this.posX = posX;
        this.posY = posY;
        this.interactionRadius = interactionRadius;
        this.onInteract = () => onInteract();
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
        this.alive = true;
        this.sprite = () => sprites.npcs.enemies.roamer;
    }

    update() {
        if (this.alive) {
            if (this.getCollision(world.segments)) this.velX -= this.velX * 2;
            this.posX += this.velX;

            this.getCollisionPlayer()
        }
    }

    getCollision(area, offsetX = 0, offsetY = 0) {
        for (let obj of area) {
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

            if (player.hitbox.x.bottom() > this.posY - 14 && player.velY > .1) {
                player.velY = -10;
                this.damage(1);
            } else {
                player.damage(1);
            }
        }
    }

    damage(amount) {
        this.hp -= amount;
        if (this.hp < 0) this.die();
    }

    die() {
        this.alive = false;
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

        if (this.blink == (this.sprite().idle.length - 1)) this.blink = 0;
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

        render.img(this.sprite().idle[Math.floor(this.blink)], this.posX - (this.width / 2), this.posY - (this.height / 2))

        if (settings.misc.halloweenMode) render.img(this.sprite().hw, this.posX - (this.width / 2), this.posY - (this.height / 2))

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

class Bogus extends Actor {
    constructor(posX, posY, onInteract) {
        super(posX, posY, onInteract, block(3));
        this.drawnSprite = 'idle';
        this.sprite = () => sprites.npcs.bogus;
    }

    update() {

    }

    boogify() {
        this.drawnSprite = 'boogus';
        this.onInteract = () => dialogue.playDialogue(bogusDialogues[6])
    }

    draw() {
        render.img(this.sprite()[this.drawnSprite][Math.round(gameClock / 8) % this.sprite().idle.length], this.posX, this.posY);
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
            "X          XX  XXXX           XX",
            "X          XX  XXXXXXXXX      XX",
            "X       ---XX  XXXXXXXXX    @ XX",
            "X          XX  XXXXXXXXXXXXXXXXX",
            "X          XX  XXXXXXXXXXXXXXXXX",
            "X---       XX  XXXXXXXXXXXXXXXXX",
            "X              XXXXXXXXXXXXXXXXX",
            "X              XXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
        ],
        advancedLayer: [
            {
                type: "E",
                x: block(5),
                y: block(0),
                width: block(2),
                height: block(0),
                entry: block(1),
                exit: 1,
                exitX: block(6),
                exitY: block(81.5),
            },
        ],
        npcs: [
            //new SpikeGuard(block(3), block(15)),
        ]
    }, {
        name: "Toybox",
        layout: [

            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "X      G                G                                   G          X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "                                                                        ",
            "X-            XXX               >>           <<   XXX               XXXX",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
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
            "XX             L    X                                                  X",
            "XX                  X                                                  X",
            "XX                  X  ^^vv                                            X",
            "XX    vv                                                               X",
            "XX       XXX                                                           X",
            "XX       XXX                                                           X",
            "XX       XXX >>     XXXMMMMXXX                     XXX                 X",
            "XX       XXX        XXXXXXXXXX---   ---X                               X",
            "XX       XXX        XXXXXXXXXX         X     XX                        X",
            "XX       XXX        X        X         X     XX                        X",
            "XX                  X        X         X     XX                        X",
            "XX ^^               X    @   X   ---   X                               X",
            "                        XX                                              ",
            "                       XXXX                                             ",
            "XXXXX--XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXX  XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
        ],
        advancedLayer: [
            {
                type: "E",
                x: block(0),
                y: block(80),
                width: block(0),
                height: block(2),
                entry: block(1),
                exit: 2,
                exitX: block(81.5),
                exitY: block(9.5),
            }, {
                type: "E",
                x: block(72),
                y: block(80),
                width: block(0),
                height: block(2),
                entry: block(1),
                exit: 3,
                exitX: block(.5),
                exitY: block(10.5),
            },
            {
                type: "E",
                x: block(72.5),
                y: block(5),
                width: block(0),
                height: block(2),
                entry: block(1),
                exit: 5,
                exitX: block(.5),
                exitY: block(1.5),
            },
            {
                type: "E",
                x: block(-.5),
                y: block(5),
                width: block(0),
                height: block(1),
                entry: block(1),
                exit: 6,
                exitX: block(42),
                exitY: block(6.5),
            }
        ],
        npcs: [
            //new TestSign(5, 90, () => dialogue.debugMsgs[0]),
            new Bogus(block(30), block(79), () => dialogue.playDialogue(bogusDialogues[0])), //block(20), block(20)),
            //new LaserTurret(block(20), block()),
            //new Roamer(block(40), block(81.5))
            new SpikeGuard(block(50), block(76))
        ]
    }, {
        name: "GA-19",
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
                exitY: block(81.5),
            }
        ],
        npcs: []
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
            "XXXX                   XXXXXX         XXXXXX                                        XXX            ",
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
                exitY: block(81.5),
            }, {
                type: "E",
                x: block(99.5),
                y: block(14),
                width: block(0),
                height: block(3),
                exit: 4,
                exitX: block(0),
                exitY: block(53.5)
            }
        ],
        npcs: []
    }, {
        name: "MNKO Swinging Course - Tower",
        layout: [
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "    XXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXX-XXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXX XXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXX XXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXX-XXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXX XXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXX         G      G         XXX",
            "XXXXXXX                  XXX-XXX",
            "XXXXXXX                  XXX XXX",
            "XXXXXXX                  XXX XXX",
            "XXXXXXX                  XXX-XXX",
            "XXXXXXX                  XXX XXX",
            "XXXXXXX                  XXX XXX",
            "XXXXXXXMMMMMMMMMMMMMMMMMMXXX-XXX",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXX XXX",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXX XXX",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXX-XXX",
            "XXXXXXX                  XXX XXX",
            "XXXXXXX                  XXX XXX",
            "XXXXXXX                  XXX-XXX",
            "XXXXXXX                  XXX XXX",
            "XXXXXXX                      XXX",
            "XXXXXXX     XXX       XXXXXXXXXX",
            "XXXXXXX     XXXMMMMMMMXXXXXXXXXX",
            "XXXXXXX     XXXXXXXXXXXXXXXXXXXX",
            "XXXXXXX     XXXXXXXXXXXXXXXXXXXX",
            "XXXXXXX     XXXXXXXXXXXXXXXXXXXX",
            "XXXXXXX     WWWWWWWWWWWWWXXXXXXX",
            "XXXXXXX         G        XXXXXXX",
            "XXXXXXX                  XXXXXXX",
            "XXXXXXX                  XXXXXXX",
            "XXXXXXX                  XXXXXXX",
            "XXXXXXX                  XXXXXXX",
            "XXXXXXX                  XXXXXXX",
            "XXXXXXX                  XXXXXXX",
            "XXXXXXX                  XXXXXXX",
            "XXXXXXXMMMMMMMMMMMMM     XXXXXXX",
            "XXXXXXXXXXXXXXXXXXXX     XXXXXXX",
            "XXXXXXXXXXXXXXXXXXXX     XXXXXXX",
            "XXXXXXXXXXXXXXXXXXXX     XXXXXXX",
            "XXXXXXXXXXXXXXXXXXXX     XXXXXXX",
            "XXXXXXXXXXXXXXXXXXXX     XXXXXXX",
            "XXXXXXXXXXXXXXXXXXXX     XXXXXXX",
            "XXXXXXXXXXXXXXXXXXXX     XXXXXXX",
            "XXXXXXXXXXXXXXXXXXXX     XXXXXXX",
            "XXXXXXXWWWWWWWWWWWWW     XXXXXXX",
            "XXXXXXX         G        XXXXXXX",
            "XXXXXXX                  XXXXXXX",
            "XXXXXXX                  XXXXXXX",
            "XXXXXXX                  XXXXXXX",
            "                         XXXXXXX",
            "                         XXXXXXX",
            "        @                XXXXXXX",
            "XXXXXXX---               XXXXXXX",
            "XXXXXXX                  XXXXXXX",
            "XXXXXXXMMMMMMMMMMMMMMMMMMXXXXXXX",
        ],
        advancedLayer: [{
            type: "E",
            x: block(-.5),
            y: block(51),
            width: block(0),
            height: block(3),
            exit: 3,
            exitX: block(98.5),
            exitY: block(16.5)
        },
        {
            type: "E",
            x: block(-.5),
            y: block(1),
            width: block(0),
            height: block(1),
            exit: 5,
            exitX: block(42.5),
            exitY: block(1.5)
        }

        ],
        npcs: [
            //new SpikeGuard(block(10), block(10)),
        ]
    }, {
        name: "MNKO Swinging Course - Vents",
        layout: [
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "                                         @ ",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
        ],
        advancedLayer: [{
            type: "E",
            x: block(43.5),
            y: block(1),
            width: block(0),
            height: block(1),
            exit: 4,
            exitX: block(0),
            exitY: block(1.5)
        }, {
            type: "E",
            x: block(-.5),
            y: block(1),
            width: block(0),
            height: block(1),
            exit: 1,
            exitX: block(71),
            exitY: block(5.5)
        },],
        npcs: []
    },
    {
        name: "GA-19 - Vents",
        layout: [
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXX                                    XXX",
            "XXX                                    XXX",
            "XXX                                    XXX",
            "XXX   XXX                        XXX   XXX",
            "XXX   XXX       XXX     XXX      XXX   XXX",
            "X                                       @ ",
            "XXXXXXMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMXXXXXX",
        ],
        advancedLayer: [{
            type: "E",
            x: block(42.5),
            y: block(6),
            width: block(0),
            height: block(1),
            exit: 1,
            exitX: block(0),
            exitY: block(5.5)
        }],
        npcs: []
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
        npcs: []
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
        advancedLayer: [],
        npcs: []
    }, {
        name: "Outside Hall of Ween",
        layout: [
            "X                             XXXXXXXXX",
            "X                             XXXXXXXXX",
            "X                             XXXXXXXXX",
            "X                             XXXXXXXXX",
            "X                             XXXXXXXXX",
            "X                             XXXXXXXXX",
            "X                               XXXXXXX",
            "X                               XXXXXXX",
            "X                                      ",
            "X                                      ",
            "X                          XXXXXXXXXXXX",
            "X                          XXXXXXXXXXXX",
            "X                        XXXXXXXXXXXXXX",
            "X                        XXXXXXXXXXXXXX",
            "X                      XXXXXXXXXXXXXXXX",
            "X                @     XXXXXXXXXXXXXXXX",
            "DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD",
            "DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD",
        ],
        advancedLayer: [
            {
                type: "E",
                x: block(39.5),
                y: block(8),
                width: block(0),
                height: block(2),
                exit: 10,
                exitX: block(0),
                exitY: block(9.5)
            }
        ],
        npcs: []
    }, {
        name: "The Hall of Ween",
        layout: [

            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX   XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX       XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXX         XXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XX                                                               XX",
            "XX                                                               XX",
            "                                                                   ",
            "@                                                                  ",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD",
            "DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD",
        ],
        advancedLayer: [
            {
                type: "E",
                x: block(-.5),
                y: block(8),
                width: block(0),
                height: block(2),
                exit: 9,
                exitX: block(39),
                exitY: block(9.5)
            }
        ],
        npcs: [
            //new TestSign(5, 90, () => dialogue.debugMsgs[0]),
            new Bogus(block(32), block(7), () => dialogue.playDialogue(bogusDialogues[5])) //block(20), block(20)),
            // new LaserTurret(block(20), block(31)),
            //new Roamer(30, 31)
        ]
    }];