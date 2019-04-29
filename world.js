var v = 0;

function getV() {
    console.log(v);
    return v;
}
block = (n) => n * 32;
class World {
    constructor(lvl) {

       
        this.blocks = []

        for (var y = 0; y < lvl.length; y++) {
            for (var x = 0; x < lvl[y].length; x++) {
                var tile = lvl[y][x];
                switch(tile){
                    case 'X':
                    this.blocks.push({
                        x: block(x),
                        y: block(y),
                        width: block(1),
                        height: block(1)
                    })
                    break
                }

            }
        }
    }
}