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
    "X                                                                     X",
    "X                                                                     X",
    "X                                                                     X",
    "X                                                                     X",
    "X                                                                     X",
    "X                                                                     X",
    "X                                                                     X",
    "X                                                                     X",
    "X                                                                     X",
    "X                                                                     X",
    "XXXXXXXXXXXXXXXXXXXXXX                                                X",
    "X                    X                                                X",
    "X                    X                                                X",
    "X                                                                     X",
    "X                M                                                    X",
    "X                X                                                    X",
    "XXXXXXXXXXXXXXXXXXXXXX-                                               X",
    "X                    X                                                X",
    "X                    X   vv                                           X",
    "X                    X                                                X",
    "X                    X                                                X",
    "X          X         X                                                X",
    "X          X                                                          X",
    "X          X     <<>>MMMMMMMMMM                     XX                X",
    "X      vv  X         XXXXXXXXXX---   ---X                             X",
    "X          X         X        X         X     XX                      X",
    "X          X         X        X         X                             X",
    "X  ^^      X         X        X   ---   X                             X",
    "X                       XXXX                                          X",
    "X    @        R         XXXX                                          X",
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
];

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
                            height: block(.1),
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
                    tile.velY = Math.fround(-Math.sin((gameClock % 6000) / 48));
                    tile.y += tile.velY;
                    break;
                case 'v':
                    tile.velY = Math.fround(Math.sin((gameClock % 6000) / 48));
                    tile.y += tile.velY;
                    break;
                case '<':
                    tile.velX = Math.fround(-Math.sin((gameClock % 6000) / 48));
                    tile.x += tile.velX;
                    break;
                case '>':
                    tile.velX = Math.fround(Math.sin((gameClock % 6000) / 48));
                    tile.x += tile.velX;
                    break;
            }
        })
        this.enemies.forEach(enemy => {
            switch (enemy.type) {
                case 'R':
                    enemy.velX = Math.fround(Math.sin((gameClock % 6000) / 48));
                    enemy.x += enemy.velX;
            }
        })
    }
}