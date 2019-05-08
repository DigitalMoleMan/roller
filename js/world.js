block = (n) => n * 32;
class World {
    constructor(lvl) {

        this.width = block(lvl[0].length);
        this.height = block(lvl.length);

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
                        })
                }

            }
        }
    }

    update() {
        this.tiles.forEach((tile) => {
            switch (tile.type) {
                case '^':
                    tile.velY = -Math.sin((gameClock % 6000) / 60);
                    tile.y += tile.velY;
                    break;
                case 'v':
                    tile.velY = Math.sin((gameClock % 6000) / 60);
                    tile.y += tile.velY;
                    //tile.y += Math.sin(gameClock % 60);
                    break;
                case '<':
                    tile.velX = -Math.sin((gameClock % 6000) / (16 * 6));

                    tile.x += tile.velX;
                    //tile.y += Math.sin(gameClock % 60);
                    break;
                case '>':
                    tile.velX = Math.sin((gameClock % 6000) / (16 * 6));

                    tile.x += tile.velX;
                    //tile.y += Math.sin(gameClock % 60);
                    break;
            }
        })
    }
}