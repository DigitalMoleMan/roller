let render = new Renderer(940, 512);
let input = new Input();
let world = new World(level);
let player = new Player();

let cam = new Camera(0,0);

var debug = 0;

var gameClock = 0;
var nearPlayer = [];
var onScreen = [];

window.onload = () => {
    render.attatchCamera(cam);
    //music[0].play();


    setInterval(() => loop(), 1000 / 60);
    scenes.game();


}

function loop() {
    
    onScreen = world.tiles.filter((tile) => (
        tile.x > (cam.x - 32) && tile.x < (render.canvas.width + cam.x) &&
        tile.y > (cam.y - 32) && tile.y < (render.canvas.height + cam.y)
    ));
    
    nearPlayer = world.tiles.filter((tile) => (
        tile.x > (player.pos.x - 64) && tile.x < (player.pos.x + 64) &&
        tile.y > (player.pos.y - 64) && tile.y < (player.pos.y + 64)
    ));
    
    
    player.readInput(input)
    player.updatePos();

    cam.follow(player.pos);

    world.update();
    //render.update('game');

    //render.camera.follow(player.pos);
    gameClock++;

}



var scenes = {
    game: () => {
        requestAnimationFrame(scenes.game)

        // background
        render.rectStatic(0, 0, render.canvas.width, render.canvas.height, '#000');


        // player
        render.img(render.sprt.player.body[player.look], (player.pos.x - player.hitbox.padding), (player.pos.y - player.hitbox.padding));

        if ((player.vel.y < 0) && !player.collision('y')) render.img(render.sprt.player.bandsJump[Math.floor(player.band) % 8], (player.pos.x - player.hitbox.padding), (player.pos.y - player.hitbox.padding) + 2);
        else render.img(render.sprt.player.bands[Math.floor(player.band % 8)], (player.pos.x - player.hitbox.padding), (player.pos.y - player.hitbox.padding));
        //render.img(player.activeGfx.bands[Math.floor(player.pos.x) % 8], player.pos.x - player.hitbox.padding, player.pos.y - player.hitbox.padding)
        


        // world
        onScreen.forEach(tile => {
            if (tile.x > cam.x - 32 && tile.x < (render.canvas.width + cam.x) &&
                tile.y > cam.y - 32 && tile.y < (render.canvas.height + cam.y)) {
                try {
                    render.img(render.sprt.tiles[tile.type], tile.x, tile.y);
                } catch {
                    render.rect(tile.x, tile.y, tile.width, tile.height, '#fff');
                }
            }
        })

        world.enemies.forEach(enemy => {
            render.img(render.sprt.enemies[enemy.type], enemy.x, enemy.y);
        })


        //debug
        if (debug) {
            render.rectStatic(0, render.canvas.height / 2, render.canvas.width, 1, '#fff');
            render.rectStatic(render.canvas.width / 2, 0, 1, render.canvas.height, '#fff');
        }

    }
}