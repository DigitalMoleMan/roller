block = (n) => n * 32;

const level = [{
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
            "X                             X----XXXX  >>        <<  XXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "X                             X    XXXX                XXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "X                             X    XXXXMMMMMMMMMMMMMMMMXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "X                             X----XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "X                                  XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "X        @                         XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXX    XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXX    XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
        ]
    },
    {
        name: "Toybox",
        layout: [
            "X                                                                      X",
            "X                                                                      X",
            "X                                                        XXXXXX        X",
            "X                                                                      X",
            "X                                                                      X",
            "X                                                                      X",
            "XXXXXXXXXX                                                             X",
            "X        X                                                             X",
            "X                                                                      X",
            "X     vv                                                               X",
            "X        XXXXXXXXXXXXXX                                                X",
            "X        X            X                                                X",
            "X    MMMMX            X                                                X",
            "X    XXXXX                                                             X",
            "X              MMMM                                                    X",
            "X              XXXX                                                    X",
            "XXXXXXXXXXXXXXXXXXXXXXX-        XXXXXXXXXX                             X",
            "XXXXXXXXXXXXXXXXXXXXXXX                                                X",
            "X                  XX                                                  X",
            "X                  XX                                                  X",
            "X                  XX   ^^vv                                           X",
            "X      vv  X       XX                                                  X",
            "X          X       XX                                                  X",
            "X          X                                                           X",
            "X          X      <<>>MMMMMMMMMM                     XX                X",
            "X          X          XXXXXXXXXX---   ---X                             X",
            "X          X          XXXXXXXXXX         X     XX                      X",
            "X @        X          X   WW   X         X     XX                      X",
            "X          X          X        X         X     XX                      X",
            "X   ^                 X        X   ---   X     WW                      X",
            "X                         XX                                           X",
            "X                        XXXX                                          X",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
        ],
        advancedLayer: [{
            type: "^",
            x: block(2),
            y: block(29),
            width: block(1),
            height: block(.1875),
            velY: 0,
            range: block(2),
            speed: 1,
        }]
    },
    {
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
        ]
    },
    {
        layout: [
            "    X          X                        ",
            "    X          X                        ",
            "    X          X                        ",
            "    X--      --XXXXXXXXXXX              ",
            "    X          X         X              ",
            "    X          X   XXXX  XXXXXXXXXXXX   ",
            "    X    --    X   X  X             X   ",
            "    X          X   X  XXXXXX     @  X   ",
            "    X          X   X       X        X   ",
            "    X       ---X   X       XXXXXXXXXX   ",
            "    X          X   X                    ",
            "    X---       X   X                    ",
            "    X              X                    ",
            "    X              X                    ",
            "    XXXXXXXXXXXXXXXX                    ",
            "                                        ",
        ],
    },
    {
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
        layout: [
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "X                                                            XX                                                                                  X",
            "X                                                            XX                                                                                  X",
            "X                                                            XX                                                                                  X",
            "X                                                            XX                                                                                  X",
            "X                                                            XX                                                                     X            X",
            "X                      XXXXXXXXXXXXXXXXXX                                                              XXXXXXXXXXXXX                X            X",
            "X                                                                                                                                   X            X",
            "X                                                                                                                                   X            X",
            "X                                                                                                                                                X",
            "X                                                                                                                                                X",
            "X                                                                                                                                                X",
            "X                                                                                                                                                X",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX                               XXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX                               XXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX                               XXXXXXXXXXXXXXXXXXXXXXX",
            "X                                                                                                                                                X",
            "X                                                                                                                                                X",
            "X                                                                                                           XXXX                                 X",
            "X                                                                                                           XXXX                                 X",
            "X                                                                                                           XXXX                                 X",
            "X                                                                                   XXXXXXXXXX              XXXX                                 X",
            "X                             XX                                                    XXXXXXXXXX                                                   X",
            "X                           XXXX                                                                                                                 X",
            "X                         XXXXXX                                                                                                                 X",
            "X    @                  XXXXXXXX                                                                                                                 X",
            "X                     XXXXXXXXXX                                                                                                                 X",
            "X                   XXXXXXXXXXXX                                                                                                                 X",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX                              XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
        ],
        advancedLayer: []
    }
];




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
                }
            }

        this.spawn = {};

        this.tiles = [];
        this.enemies = [];
    }

    loadLevel(lvl) {

        this.width = block(lvl.layout[0].length);
        this.height = block(lvl.layout.length);

        this.tiles = [];
        this.enemies = [];

        for (var y = 0; y < lvl.layout.length; y++) {
            for (var x = 0; x < lvl.layout[y].length; x++) {
                var tile = lvl.layout[y][x];
                switch (tile) {
                    case '@':
                        this.spawn.x = block(x) + 16;
                        this.spawn.y = block(y) + 16;
                    case 'X':
                        this.tiles.push({
                            x: block(x),
                            y: block(y),
                            width: block(1),
                            height: block(1),
                            type: tile
                        });
                        break
                    case '-':
                        this.tiles.push({
                            x: block(x),
                            y: block(y),
                            width: block(1),
                            height: block(.125),
                            type: tile
                        });
                        break
                    case '^':
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
                    case 'v':
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
                        break;
                    case 'R':
                        this.enemies.push({
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

        lvl.advancedLayer.forEach((element) => this.tiles.push(element));
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
        this.enemies.forEach(enemy => {
            switch (enemy.type) {
                case 'R':
                    enemy.velX = Math.fround(Math.sin((gameClock) / 48));
                    enemy.x += enemy.velX;
            }
        })
    }
}