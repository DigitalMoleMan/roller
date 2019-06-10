/*
    const level = [
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
    ];
*/


const level = [
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
    "XXXXXXXXXXXXXXXXXXXXXXX                                                X",
    "X                     X                                                X",
    "X                     X                                                X",
    "X                                                                      X",
    "X              MMMM                                                    X",
    "X              XXXX                                                    X",
    "XXXXXXXXXXXXXXXXXXXXXXX-                                               X",
    "XXXXXXXXXXXXXXXXXXXXXXX                                                X",
    "X                  XX                                                  X",
    "X                  XX                                                  X",
    "X                  XX   ^^vv                                           X",
    "X                  XX                                                  X",
    "X         -X-      XX                                                  X",
    "X          X                                                           X",
    "X      vv  X      <<>>MMMMMMMMMM                     XX                X",
    "X          X          XXXXXXXXXX---   ---X                             X",
    "X          X          XXXXXXXXXX         X     XX                      X",
    "X          X          X        X         X                             X",
    "X  ^^      X          X        X   ---   X                             X",
    "X                        XXXX            X                             X",
    "X    @                   XXXX            X                             X",
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
];

/*
const level = [
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
];
*/
/*
const level = [
    "XXXXXXXXXXXXXXXXXXXX",
    "X                  X",
    "X                  X",
    "X                  X",
    "X                  X",
    "X                  X",
    "X                  X",
    "X                  X",
    "X      >   v       X",
    "X                  X",
    "X                  X",
    "X                  X",
    "X      ^   <       X",
    "X                  X",
    "X    @             X",
    "XXXXXXXXXXXXXXXXXXXX",
]
*/

block = (n) => n * 32;

class World {
    constructor(lvl) {

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

            this.width = block(lvl[0].length);
        this.height = block(lvl.length);

        this.spawn = {};

        this.tiles = [];
        this.enemies = []; {
            /*
                    for (var y = 0; y < lvl.length; y++) {
                        for (var x = 0; x < lvl[y].length; x++) {
                            var tile = lvl[y][x];
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
                                        height: block(.25),
                                        velY: 0,
                                        type: tile
                                    });
                                    break
                                case '^':
                                    this.tiles.push({
                                        x: block(x),
                                        y: block(y),
                                        oy: block(y),
                                        width: block(1),
                                        height: block(.5),
                                        velY: 0,
                                        type: tile
                                    });
                                    break;
                                case 'v':
                                    this.tiles.push({
                                        x: block(x),
                                        y: block(y),
                                        width: block(1),
                                        height: block(.5),
                                        velY: 0,
                                        type: tile
                                    });
                                    break;
                                case '<':
                                    this.tiles.push({
                                        x: block(x),
                                        y: block(y),
                                        width: block(1),
                                        height: block(.5),
                                        velX: 0,
                                        type: tile
                                    });
                                    break;
                                case '>':
                                    this.tiles.push({
                                        x: block(x),
                                        y: block(y),
                                        width: block(1),
                                        height: block(.5),
                                        velX: 0,
                                        type: tile
                                    });
                                    break;
                                case 'M':
                                    this.tiles.push({
                                        x: block(x),
                                        y: block(y + .75),
                                        width: block(1),
                                        height: block(.05),
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
                    }*/
        }
    }

    loadLevel(lvl) {

        this.width = block(lvl[0].length);
        this.height = block(lvl.length);

        this.tiles = [];
        this.enemies = [];

        for (var y = 0; y < lvl.length; y++) {
            for (var x = 0; x < lvl[y].length; x++) {
                var tile = lvl[y][x];
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
                            height: block(.25),
                            velY: 0,
                            type: tile
                        });
                        break
                    case '^':
                        this.tiles.push({
                            x: block(x),
                            y: block(y),
                            oy: block(y),
                            width: block(1),
                            height: block(.5),
                            velY: 0,
                            type: tile
                        });
                        break;
                    case 'v':
                        this.tiles.push({
                            x: block(x),
                            y: block(y),
                            width: block(1),
                            height: block(.5),
                            velY: 0,
                            type: tile
                        });
                        break;
                    case '<':
                        this.tiles.push({
                            x: block(x),
                            y: block(y),
                            width: block(1),
                            height: block(.5),
                            velX: 0,
                            type: tile
                        });
                        break;
                    case '>':
                        this.tiles.push({
                            x: block(x),
                            y: block(y),
                            width: block(1),
                            height: block(.5),
                            velX: 0,
                            type: tile
                        });
                        break;
                    case 'M':
                        this.tiles.push({
                            x: block(x),
                            y: block(y + .75),
                            width: block(1),
                            height: block(.05),
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
    }

    update() {
        this.tiles.forEach((tile) => {
            switch (tile.type) {
                case '^':
                    tile.velY = -Math.sin(gameClock / 64);
                    tile.y += tile.velY;
                    break;
                case 'v':
                    tile.velY = Math.sin(gameClock / 64);
                    tile.y += tile.velY;
                    break;
                case '<':
                    tile.velX = -Math.sin(gameClock / 64);
                    tile.x += tile.velX;
                    break;
                case '>':
                    tile.velX = Math.sin(gameClock / 64);
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