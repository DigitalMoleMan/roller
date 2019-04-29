let render = new Renderer();
let input = new Input();
let world = new World(level);
let player = new Player();

let cam = new Camera();

function init() {
    loop();
}
function loop() {
    player.readInput(input)
    player.updatePos();
    render.update();
    cam.follow(player.pos);
    setTimeout(() => loop(), 1000 / 60);
}


var scenes = {
    game: [
        () => { //player
            render.rectStatic(0, 0, render.canvas.width, render.canvas.height, '#000');
            render.img(player.activeGfx.bands[Math.floor(player.pos.x) % 8], player.pos.x, player.pos.y);
            render.img(player.activeGfx.body[6 + player.look], player.pos.x, player.pos.y);
        },

        () => {
            render.rect(100, 10, 10, 10, '#fff');
        },

        () => { // world
            world.blocks.forEach(block => {
                render.rect(block.x, block.y, block.width, block.height, '#fff');
            })
        }
    ]
}

init()