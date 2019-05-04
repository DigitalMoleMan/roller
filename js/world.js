block = (n) => n * 32;
class World {
    constructor(lvl) {


        this.tiles = []

        for (var y = 0; y < lvl.length; y++) {
            for (var x = 0; x < lvl[y].length; x++) {
                var tile = lvl[y][x];
                switch (tile) {
                    case 'X':
                        this.tiles.push({
                            x: block(x),
                            y: block(y),
                            width: block(1),
                            height: block(1),
                            type: 'X'
                        });
                        break
                    case '-':
                        this.tiles.push({
                            x: block(x),
                            y: block(y),
                            width: block(1),
                            height: block(.25),
                            velY: 0,
                            type: '-'
                        });
                        break
                        case '=':
                        this.tiles.push({
                            x: block(x),
                            y: block(y),
                            width: block(1),
                            height: block(.5),
                        })
                }

            }
        }
    }

    update() {
        this.tiles.forEach((tile) => {
            switch (tile.type) {
                case '=':
                tile.velY -= .01;

                tile.y += tile.velY;
                    //tile.y += Math.sin(gameClock % 60);
                    break;
            }
        })
    }
}