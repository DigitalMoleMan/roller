let render = new Renderer();
let input = new Input();
let world = new World(level);
let player = new Player();

let cam = new Camera();

var debug = 1;

var onScreen;

function loop() {
    onScreen = world.tiles.filter((tile) => (
        tile.x > (cam.x - 32) && tile.x < (render.canvas.width + cam.x) &&
        tile.y > (cam.y - 32) && tile.y < (render.canvas.height + cam.y)
    ));

    world.update();
    player.readInput(input)
    player.updatePos();
    
    render.update('game');
    cam.follow(player.pos);
}



var scenes = {
    game: () => { 
        // background
        render.rectStatic(0, 0, render.canvas.width, render.canvas.height, '#000');

        // player
        render.img(player.activeGfx.bands[Math.floor(player.pos.x) % 8], player.pos.x, player.pos.y);
        render.img(player.activeGfx.body[player.look], player.pos.x, player.pos.y);


        // world
        onScreen.forEach(tile => {
            if (tile.x > cam.x - 32 && tile.x < (render.canvas.width + cam.x) &&
                tile.y > cam.y - 32 && tile.y < (render.canvas.height + cam.y)) {
                    try{
                render.img(render.sprt.tiles[tile.type], tile.x, tile.y);
                    }catch{
                        render.rect(tile.x, tile.y, tile.width, tile.height, '#fff');
                    }
            }
        })
    }
}



window.onload = () => {
    setInterval(() => loop(), 1000 / 60);
}