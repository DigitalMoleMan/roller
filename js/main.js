//let menu = new Menu();
let render = new Renderer(640, 512);
let input = new Input();
let world = new World(level);
let player = new Player(world.spawn.x, world.spawn.y);

let camera = new Camera(0, 0);

var debug = 1;

var gameClock = 0;
var nearPlayer = [];
var onScreen = [];

//loading textures
render.sprt = {
    player: {
        body: render.importSprite('img/player/body', 13),
        bands: render.importSprite('img/player/bands', 8),
        bandsJump: render.importSprite('img/player/bands_jump', 8),
    },
    tiles: {
        "@": render.importImage('img/tiles/break_block_0.png'),
        "X": render.importImage('img/tiles/block.png'),
        "-": render.importImage('img/tiles/platform.png'),
        "^": render.importImage('img/tiles/elevator.png'),
        "v": render.importImage('img/tiles/elevator.png'),
        "<": render.importImage('img/tiles/elevator.png'),
        ">": render.importImage('img/tiles/elevator.png'),
        "M": render.importImage('img/tiles/spikes.png'),
        "¤": render.importSprite('img/tiles/cog', 4),
        "#": render.importImage('img/tiles/break_block', 2),
    },
    enemies: {
        "R": render.importSprite('img/enemies/roamer', 4)
    }
}

var music = [
    new Audio('audio/music/Ready_to_Roll.mp3')
];


window.onload = () => {
    render.attatchCamera(camera);
    //music[0].play();

    setInterval(() => loop(), 1000 / 60);
    render.update();
}

function loop() {

    onScreen = world.tiles.filter((tile) => (
        tile.x > (camera.x - 32) && tile.x < (render.canvas.width + camera.x) &&
        tile.y > (camera.y - 32) && tile.y < (render.canvas.height + camera.y)
    ));

    nearPlayer = world.tiles.filter((tile) => (
        tile.x > (player.pos.x - 64) && tile.x < (player.pos.x + 32) &&
        tile.y > (player.pos.y - 64) && tile.y < (player.pos.y + 32)
    ));


    player.readInput(input)
    player.updatePos();

    camera.follow(player.pos);

    world.update();

    //render.camera.follow(player.pos);
    gameClock++;

}



var scenes = {
    menu: () => {

        // background
        render.rectStatic(0, 0, render.canvas.width, render.canvas.height, '#000');


    },
    game: () => {

        // background
        render.rectStatic(0, 0, render.canvas.width, render.canvas.height, '#000');


        // player
        //render.img(render.sprt.player.body[player.look], (player.pos.x - player.hitbox.padding), (player.pos.y - player.hitbox.padding));

        //if (player.midJump) render.img(render.sprt.player.bandsJump[Math.floor(player.band) % 8], (player.pos.x - player.hitbox.padding), (player.pos.y - player.hitbox.padding) + 2);
        //else render.img(render.sprt.player.bands[Math.floor(player.band % 8)], (player.pos.x - player.hitbox.padding), (player.pos.y - player.hitbox.padding));
        //render.img(player.activeGfx.bands[Math.floor(player.pos.x) % 8], player.pos.x - player.hitbox.padding, player.pos.y - player.hitbox.padding)

        // world
        onScreen.forEach(tile => {

            try {
                var texture = render.sprt.tiles[tile.type];

                render.img(texture, tile.x, tile.y);

            } catch {
                render.rect(tile.x, tile.y, tile.width, tile.height, '#fff');
            }
        })



        world.enemies.forEach(enemy => {
            try {
                render.img(render.sprt.enemies[enemy.type][Math.round(enemy.x / 2) % render.sprt.enemies[enemy.type].length], enemy.x, enemy.y);
            } catch {
                console.log(render.sprt.enemies[enemy.type]);
                render.rect(enemy.x, enemy.y, enemy.width, enemy.height, '#fff');
            }
        })
        
        //debug
        if (debug) {
            //render.rectStatic(0, render.canvas.height / 2, render.canvas.width, 1, '#f00');
            //render.rectStatic(render.canvas.width / 2, 0, 1, render.canvas.height, '#0f0');
            var hb = player.hitbox;

            render.rectStroke(hb.x.left(), hb.x.top(), hb.x.right() - hb.x.left(), hb.x.bottom() - hb.x.top(), "#f00");
            render.rectStroke(hb.y.left(), hb.y.top(), hb.y.right() - hb.y.left(), hb.y.bottom() - hb.y.top(), "#0f0");

            render.rectStroke(1,1,1,1,"#fff")
            //render.line(player.pos.x, player.pos.y, player.pos.x + (player.vel.x * 5), player.pos.y + (player.vel.y * 5), "#ff0")
        }

    }
}