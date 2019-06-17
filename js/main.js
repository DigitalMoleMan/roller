/**
 * Roller - main.js
 */
const mainDOM = document.getElementById("main");
const canvasContainer = document.getElementById("canvasContainer");

//Mobile
var onMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const mobileControls = document.getElementById("mobileControls");
const mobileLRstick = document.getElementById("LRstick");
const mobileJump = document.getElementById("mobileJump");
var stickDown = false;

//let menu = new Menu();
let render = new Renderer(640, 512);
let input = new Input();
let world = new World(level);


let player = new Player(world.spawn.x, world.spawn.y);
let camera = new Camera(world.spawn.x, world.spawn.y);

var debug = 0

var gameClock = 0;
var nearPlayer = [];
var onScreen = [];



//loading textures
var sprites = {
    player: {
        body: render.importSprite('img/player/body', 13),
        bands: render.importSprite('img/player/bands', 8),
        bandsJump: render.importSprite('img/player/bands_jump', 8),
    },
    tiles: {
        "@": render.importImage('img/tiles/break_block_0.png'),
        "X": render.importImage('img/tiles/block.png'),
        "-": render.importImage('img/tiles/platform.png'),
        "^": render.importSprite('img/tiles/elevator', 8),
        "v": render.importSprite('img/tiles/elevator', 8),
        "<": render.importSprite('img/tiles/elevator', 8),
        ">": render.importSprite('img/tiles/elevator', 8),
        "M": render.importImage('img/tiles/spikes_floor.png'),
        "W": render.importImage('img/tiles/spikes_roof.png'),
        "¤": render.importSprite('img/tiles/cog', 4),

        //"#": render.importImage('img/tiles/break_block', 2),
    },
    enemies: {
        "R": render.importSprite('img/enemies/roamer', 4)
    },
    backgrounds: {
        main: render.importImage('img/backgrounds/main.png')
    }
}

var music = [
    new Audio('audio/music/Ready_to_Roll.mp3')
];


window.onload = () => {
    console.log(onMobile);
    (onMobile) ? mobileControls.style.display = "block": mobileControls.style.display = "none";
    world.loadLevel(level[1])
    player.pos.x = world.spawn.x;
    player.pos.y = world.spawn.y;
    render.attatchCamera(camera);
    //music[0].play();

    setInterval(() => loop(), 1000 / 60);
    render.update();
}

function loop() {
    gameClock++;
    onScreen = world.tiles.filter((tile) => (
        tile.x > (camera.x - 32) && tile.x < (render.canvas.width + camera.x) &&
        tile.y > (camera.y - 32) && tile.y < (render.canvas.height + camera.y)
    ));

    nearPlayer = world.tiles.filter((tile) => (
        tile.x > (player.pos.x - 64) && tile.x < (player.pos.x + 32) &&
        tile.y > (player.pos.y - 64) && tile.y < (player.pos.y + 32)
    ));

    if (onMobile) {
        console.log(mobileLRstick < 0);
        input.keys[input.binds.left] = (mobileLRstick.value < 0);
        input.keys[input.binds.right] = (mobileLRstick.value > 0);

        input.keys[input.binds.sprint] = ((mobileLRstick.value < -1) || (mobileLRstick.value > 1)) 
    }
    player.readInput(input)
    player.updatePos();

    camera.follow(player.pos);

    world.update();

    //render.camera.follow(player.pos);

}



var scenes = {
    menu: () => {


        // background


        //render.rectStatic(0, 0, render.canvas.width, render.canvas.height, '#000');


    },
    game: () => {

        // background
        for (y = 0; y < render.canvas.width + 64; y += 64) {
            for (x = 0; x < render.canvas.width + 64; x += 64) {

                render.img(sprites.backgrounds.main, x + camera.x - (camera.x / 3) % 64, y + camera.y - (camera.y / 3) % 64, 64, 64);
            }
        }

        //render.rectStatic(0, 0, render.canvas.width, render.canvas.height, '#000');


        // player
        render.img(sprites.player.body[player.look], (player.pos.x - 16), (player.pos.y - 16), 32, 32);

        if (player.midJump) render.img(sprites.player.bandsJump[Math.floor(player.band) % sprites.player.bandsJump.length], (player.pos.x - 16), (player.pos.y - 16) + 2);
        else render.img(sprites.player.bands[Math.floor(player.band % 8)], (player.pos.x - 16), (player.pos.y - 16));
        //render.img(player.activeGfx.bands[Math.floor(player.pos.x) % 8], player.pos.x - 16, player.pos.y - 16)

        // world
        onScreen.forEach(tile => {

            try {
                var texture = sprites.tiles[tile.type];

                if (texture.length > 1) {
                    render.img(texture[gameClock % texture.length], tile.x, tile.y);
                } else {


                    render.img(texture, tile.x, tile.y);
                }

            } catch {
                render.rect(tile.x, tile.y, tile.width, tile.height, '#fff');
            }
        })



        world.enemies.forEach(enemy => {
            try {
                render.img(sprites.enemies[enemy.type][Math.round(enemy.x / 2) % sprites.enemies[enemy.type].length], enemy.x, enemy.y);
            } catch {
                console.log(sprites.enemies[enemy.type]);
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

            //render.line(player.pos.x, player.pos.y, player.pos.x + (player.vel.x * 5), player.pos.y + (player.vel.y * 5), "#ff0")
        }

    }
}