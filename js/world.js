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
    }

    loadLevel(lvl) {

        this.width = block(lvl.layout[0].length);
        this.height = block(lvl.layout.length);

        this.tiles = [];
        this.npcs = [];

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
                            type: tile
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
                            height: block(.5),
                            type: tile
                        });
                        break;
                    case 'W':
                        this.tiles.push({
                            x: block(x),
                            y: block(y),
                            width: block(1),
                            height: block(.5),
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
        } catch {

        }
    }

    update() {
        this.tiles.forEach((tile) => {
            switch (tile.type) {
                case '^':

                    tile.velY = -Math.sin((gameClock) / (tile.range / tile.speed)) * tile.speed;
                    tile.y += tile.velY;
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
            }
        })
        this.npcs.forEach(npc => {
            npc.update();
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

        //rendering
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
        }
        this.posX += this.velX;
        this.posY += this.velY;

        this.velX *= this.deceleration;
        this.velY *= this.deceleration;

        if(this.checkCollision()) {
            player.kill();
            this.posX = this.originX;
            this.posY = this.originY;
        }
    }

    checkCollision() {
        if (player.posX + 16 < this.posX + this.width &&
            player.posX + 16 > this.posX &&
            player.posY + 16< this.posY + this.height &&
            player.posY + 16 > this.posY) return true;
        else return false;
    }

    draw() {
        this.sprite = sprites.npcs.enemies.spikeGuard;
        render.img(this.sprite[0], this.posX - (this.width / 2), this.posY - (this.height / 2))

        if (this.fromPlayer < this.detectionRadius) {
        var rotation = Math.atan2(player.posY - this.posY, player.posX - this.posX);
        render.rect((this.posX - 2) + Math.cos(rotation) * 2, (this.posY - 2) + Math.sin(rotation) * 2, 4, 4, "#29adff");
        } else {
            render.rect((this.posX - 2) + this.velX, (this.posY - 2) + this.velY, 4, 4, "#29adff");
        }
    }
}


const level = [{
        name: "GA valley",
        layout: [
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
        advancedLayer: [{
            type: "E",
            x: block(82),
            y: block(6),
            width: block(0),
            height: block(2),
            entry: block(1),
            exit: 1,
            exitX: block(2),
            exitY: block(29),
        }]
    },
    {
        name: "Toybox",
        layout: [
            "X                    G                 G                               X",
            "X                                                                      X",
            "X                                                        XXXXXX        X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "XXXXXXXXXX                                            G                X",
            "X        X                                                             X",
            "X                                                                      X",
            "X     vv                                                               X",
            "X        XXXXXXXXXXXXXX                                                X",
            "X        X            X                        G                       X",
            "X    MMMMX            X                                                X",
            "X    XXXXX                                                             X",
            "X              MMMM                                                    X",
            "X              XXXX                                                    X",
            "XXXXXXXXXXXXXXXXXXXXXXX-        XXXXXXXXXX                             X",
            "XXXXXXXXXXXXXXXXXXXXXXX           G    G                               X",
            "X          G       XX                                                  X",
            "X                  XX                                                  X",
            "X                  XX   ^^vv                                           X",
            "X      vv  X       XX                                                  X",
            "X          X       XX                                                  X",
            "X          X                                                           X",
            "X          X      <<>>MMMMMMMMMM                     XX                X",
            "X          X          XXXXXXXXXX---   ---X                             X",
            "X          X          XXXXXXXXXX         X     XX                      X",
            "X                     X   WW   X         X     XX                      X",
            "X                     X        X         X     XX                      X",
            "X  ^^                 X        X   ---   X     WW                      X",
            "                          XX                                            ",
            "           @             XXXX                                           ",
            "XXXXX--XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXX  XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
        ],
        advancedLayer: [{
            type: "E",
            x: block(0),
            y: block(30),
            width: block(0),
            height: block(2),
            entry: block(1),
            exit: 0,
            exitX: block(80),
            exitY: block(6),
        }, {
            type: "E",
            x: block(72),
            y: block(30),
            width: block(0),
            height: block(2),
            entry: block(1),
            exit: 5,
            exitX: block(.5),
            exitY: block(8.5),
        }],
        npcs: []
    },
    {
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
        advancedLayer: [{
            type: "E",
            x: block(0),
            y: block(7),
            width: block(1),
            height: block(2),
            entry: block(1),
            exit: 1,
            exitX: block(70),
            exitY: block(29),
        }, {
            type: "E",
            x: block(98),
            y: block(12),
            width: block(1),
            height: block(3),
            exit: 1,
            exitX: block(70),
            exitY: block(29),

        }]
    },
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
            "X    --    X         XXXXXXXXXXX",
            "X          X   XXXX  XXXXXXXXXXX",
            "X          X   XXXX            X",
            "X          X   XXXXXXXXX       X",
            "X       ---X   XXXXXXXXX    @  X",
            "X          X   XXXXXXXXXXXXXXXXX",
            "X          X   XXXXXXXXXXXXXXXXX",
            "X---       X   XXXXXXXXXXXXXXXXX",
            "X              XXXXXXXXXXXXXXXXX",
            "X              XXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
        ],
        advancedLayer: [{
            type: "E",
            x: block(5),
            y: block(0),
            width: block(2),
            height: block(.1),
            entry: block(1),
            exit: 1,
            exitX: block(6),
            exitY: block(30),
        }]
    },
    {
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
            "X                  X",
            "X                  X",
            "X                  X",
            "X         @        X",
            "XXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXX",
        ],
        advancedLayer: [{
                type: "v",
                x: block(1),
                y: block(10),
                width: block(1),
                height: block(1),
                range: block(2),
                speed: 1,
            }, {
                type: "v",
                x: block(2),
                y: block(10),
                width: block(1),
                height: block(1),
                range: block(2),
                speed: 2,
            }, {
                type: "v",
                x: block(3),
                y: block(10),
                width: block(1),
                height: block(1),
                range: block(2),
                speed: 3,
            },
            {
                type: "v",
                x: block(4),
                y: block(10),
                width: block(1),
                height: block(1),
                range: block(2),
                speed: 4,
            },
            {
                type: "v",
                x: block(5),
                y: block(10),
                width: block(1),
                height: block(1),
                range: block(2),
                speed: 5,
            }, {
                type: "v",
                x: block(6),
                y: block(10),
                width: block(1),
                height: block(1),
                range: block(2),
                speed: 6,
            }, {
                type: "v",
                x: block(7),
                y: block(10),
                width: block(1),
                height: block(1),
                range: block(2),
                speed: 7,
            }, {
                type: "v",
                x: block(8),
                y: block(10),
                width: block(1),
                height: block(1),
                range: block(2),
                speed: 8,
            }, {
                type: "v",
                x: block(9),
                y: block(10),
                width: block(1),
                height: block(1),
                range: block(2),
                speed: 9,
            }, {
                type: "v",
                x: block(10),
                y: block(10),
                width: block(1),
                height: block(1),
                range: block(2),
                speed: 9,
            }, {
                type: "v",
                x: block(11),
                y: block(10),
                width: block(1),
                height: block(1),
                range: block(2),
                speed: 8,
            }, {
                type: "v",
                x: block(12),
                y: block(10),
                width: block(1),
                height: block(1),
                range: block(2),
                speed: 7,
            }, {
                type: "v",
                x: block(13),
                y: block(10),
                width: block(1),
                height: block(1),
                range: block(2),
                speed: 6,
            }, {
                type: "v",
                x: block(14),
                y: block(10),
                width: block(1),
                height: block(1),
                range: block(2),
                speed: 5,
            }, {
                type: "v",
                x: block(15),
                y: block(10),
                width: block(1),
                height: block(1),
                range: block(2),
                speed: 4,
            }, {
                type: "v",
                x: block(16),
                y: block(10),
                width: block(1),
                height: block(1),
                range: block(2),
                speed: 3,
            }, {
                type: "v",
                x: block(17),
                y: block(10),
                width: block(1),
                height: block(1),
                range: block(2),
                speed: 2,
            }, {
                type: "v",
                x: block(18),
                y: block(10),
                width: block(1),
                height: block(1),
                range: block(2),
                speed: 1,
            }, {
                type: "^",
                x: block(1),
                y: block(10),
                width: block(1),
                height: block(1),
                range: block(2),
                speed: 1,
            }, {
                type: "^",
                x: block(2),
                y: block(10),
                width: block(1),
                height: block(1),
                range: block(2),
                speed: 2,
            }, {
                type: "^",
                x: block(3),
                y: block(10),
                width: block(1),
                height: block(1),
                range: block(2),
                speed: 3,
            },
            {
                type: "^",
                x: block(4),
                y: block(10),
                width: block(1),
                height: block(1),
                range: block(2),
                speed: 4,
            },
            {
                type: "^",
                x: block(5),
                y: block(10),
                width: block(1),
                height: block(1),
                range: block(2),
                speed: 5,
            }, {
                type: "^",
                x: block(6),
                y: block(10),
                width: block(1),
                height: block(1),
                range: block(2),
                speed: 6,
            }, {
                type: "^",
                x: block(7),
                y: block(10),
                width: block(1),
                height: block(1),
                range: block(2),
                speed: 7,
            }, {
                type: "^",
                x: block(8),
                y: block(10),
                width: block(1),
                height: block(1),
                range: block(2),
                speed: 8,
            }, {
                type: "^",
                x: block(9),
                y: block(10),
                width: block(1),
                height: block(1),
                range: block(2),
                speed: 9,
            }, {
                type: "^",
                x: block(10),
                y: block(10),
                width: block(1),
                height: block(1),
                range: block(2),
                speed: 9,
            }, {
                type: "^",
                x: block(11),
                y: block(10),
                width: block(1),
                height: block(1),
                range: block(2),
                speed: 8,
            }, {
                type: "^",
                x: block(12),
                y: block(10),
                width: block(1),
                height: block(1),
                range: block(2),
                speed: 7,
            }, {
                type: "^",
                x: block(13),
                y: block(10),
                width: block(1),
                height: block(1),
                range: block(2),
                speed: 6,
            }, {
                type: "^",
                x: block(14),
                y: block(10),
                width: block(1),
                height: block(1),
                range: block(2),
                speed: 5,
            }, {
                type: "^",
                x: block(15),
                y: block(10),
                width: block(1),
                height: block(1),
                range: block(2),
                speed: 4,
            }, {
                type: "^",
                x: block(16),
                y: block(10),
                width: block(1),
                height: block(1),
                range: block(2),
                speed: 3,
            }, {
                type: "^",
                x: block(17),
                y: block(10),
                width: block(1),
                height: block(1),
                range: block(2),
                speed: 2,
            }, {
                type: "^",
                x: block(18),
                y: block(10),
                width: block(1),
                height: block(1),
                range: block(2),
                speed: 1,
            },
        ]
    },
    {
        name: "MNKO Swinging Course - Hall",
        layout: [
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
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
            "XXXXMMMMMMMMMMMMMMMMMMMXXXXXX         XXXXXX                                        XXXXXXXXXXXXXXX",
        ],
        advancedLayer: [{
            type: "E",
            x: block(0),
            y: block(7),
            width: block(0),
            height: block(2),
            exit: 1,
            exitX: block(71.5),
            exitY: block(31.5),
        }, {
            type: "E",
            x: block(99),
            y: block(13),
            width: block(0),
            height: block(2),
            exit: 6,
            exitX: block(.5),
            exitY: block(29.5)
        }]
    },
    {
        name: "MNKO Swinging Course - Tower",
        layout: [
            "XXXXXXXXXXXXXXXXXXXX",
            "X                  X",
            "X                  X",
            "X                  X",
            "X                  X",
            "X                  X",
            "X                  X",
            "X         XXXXXXXXXX",
            "X      -XXX        X",
            "X                  X",
            "X                  X",
            "X------XXXXXXXX    X",
            "X      XXXXWWWG    X",
            "X      XXXX        X",
            "X      XXXX        X",
            "X      XXXX        X",
            "X      XXXX    MMMMX",
            "XXXXXXXXXXX    XXXXX",
            "XXXXXXXXXXX    GWWWX",
            "XXXXXXXXXXX        X",
            "XXXXXXXXXXX        X",
            "XXXXXXXXXXX        X",
            "XXXXXXXXXXXMMMM    X",
            "XXXXXXXXXXXXXXX    X",
            "XWWWWWWWWWWWWWW    X",
            "X          G       X",
            "X                  X",
            "X                  X",
            "                   X",
            "  @                X",
            "X---               X",
            "X                  X",
            "XMMMMMMMMMMMMMMMMMMX",
        ],
        advancedLayer: [{
                type: "E",
                x: block(0),
                y: block(28),
                width: block(0),
                height: block(2),
                exit: 5,
                exitX: block(98.5),
                exitY: block(14.5)
            }

        ],
        npcs: [
            new SpikeGuard(block(3), block(15)),
        ]
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
    }
];