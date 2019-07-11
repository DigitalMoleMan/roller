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
            "X      vv  X       XX                                                  X",
            "X          X       XX                                                  X",
            "X          X                                                           X",
            "X          X      <<>>MMMMMMMMMM                     XX                X",
            "X          X          XXXXXXXXXX---   ---X                             X",
            "X          X          XXXXXXXXXX         X     XX                      X",
            "X          X          X   WW   X         X     XX                      X",
            "X          X          X        X         X     XX                      X",
            "X  ^^                 X        X   ---   X     WW                      X",
            "X                         XX                                           X",
            "X    @                   XXXX                                          X",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
        ],
        advancedLayer: [{
            type: "X",
            x: block(4),
            y: block(4),
            width: block(1),
            height: block(1),

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
    }
];




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
                            velY: 0,
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
                            type: tile
                        });
                        break;
                    case 'v':
                        this.tiles.push({
                            x: block(x),
                            y: block(y),
                            width: block(1),
                            height: block(0.1875),
                            velY: 0,
                            type: tile
                        });
                        break;
                    case '<':
                        this.tiles.push({
                            x: block(x),
                            y: block(y),
                            width: block(1),
                            height: block(0.1875),
                            velX: 0,
                            type: tile
                        });
                        break;
                    case '>':
                        this.tiles.push({
                            x: block(x),
                            y: block(y),
                            width: block(1),
                            height: block(0.1875),
                            velX: 0,
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

        lvl.advancedLayer.forEach(element => {
            this.tiles.push(element);
        });
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