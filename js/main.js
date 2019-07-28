/**
 * Roller - main.js
 */
const mainDOM = document.getElementById("main");
const canvasContainer = document.getElementById("canvasContainer");

//Mobile
var onMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
if (onMobile) {
    window.addEventListener("orientationchange", () => {
        setTimeout(() => {
            canvasWidth = window.innerWidth;
            canvasHeight = window.innerHeight;
            render.canvas.width = canvasWidth;
            render.canvas.height = canvasHeight;
            //render.refreshCanvas();
            console.log(screen.orientation)
        }, 100)

    })
}
const mobileControls = document.getElementById("mobileControls");

//let menu = new Menu();

var canvasWidth = 640;
var canvasHeight = 512;

if (onMobile) {
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
}

let render = new Renderer(canvasWidth, canvasHeight);
let input = new Input({ //Binds
    //movement
    up: 'arrowup',
    down: 'arrowdown',
    left: 'a',
    right: 'd',

    //actions
    jump: ' ',
    sprint: 'shift',
    use: 'n',

    //misc
    pause: 'p',

    //dev
    toggleDebug: 'f',
});

let menu = new Menu();

let world = new World();

world.loadLevel(level[1])

let player = new Player(world.spawn.x, world.spawn.y);
let camera = new Camera();
let particleEng = new ParticleEngine();



var debug = false;

var gameClock = 0;
var activeScene
var nearPlayer = [];
var onScreen = [];



//Loading sprites
var sprites = {
    ui: {
        label: {
            hp: render.importImage('img/ui/hp_label.png'),
        },
        statbar: {
            left: render.importSprite('img/ui/statbar_left', 2),
            right: render.importSprite('img/ui/statbar_right', 2),
            mid: render.importSprite('img/ui/statbar_mid', 2),
            point: render.importImage('img/ui/hp_point.png', 2),
        },
    },
    player: {
        body: render.importSprite('img/player/body', 13),
        bands: render.importSprite('img/player/bands', 8),
        bandsJump: render.importSprite('img/player/bands_jump', 8),
        cannon: render.importSprite('img/player/cannon', 13),
        hookshot: render.importSprite('img/player/hookshot', 8)
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
        "G": render.importImage('img/tiles/hookpoint.png'),
        "¤": render.importSprite('img/tiles/cog', 4),


        //"#": render.importImage('img/tiles/break_block', 2),
    },
    npcs: {
        enemies: {
            spikeGuard: render.importSprite('img/npcs/enemies/spike_guard/body_idle', 4)
        },
    },
    enemies: {
        "R": render.importSprite('img/enemies/roamer', 4)
    },
    backgrounds: {
        main: render.importImage('img/backgrounds/main.png'),
        main2: render.importImage('img/backgrounds/main2.png'),
        metal: render.importImage('img/backgrounds/metal_bg.png')
    }
}

//Loading Audio

var music = [
    'audio/music/Ready_to_Roll.wav',
    'audio/music/Among disks and drives.wav',
    'audio/music/A mile too deep.wav',
    'audio/music/Cryogenic Malfunction.wav',
    'audio/music/Forgotten Sins.wav',
    'audio/music/Gearing Up.wav',
    'audio/music/Persistent Foe.wav',
    'audio/music/Rambling Machine.wav',
    'audio/music/The Tribute.wav',
    'audio/music/Chain Reactor.wav',
    'audio/music/Hollow.wav',
    'audio/music/Spaced Sax.wav',
];

var sfx = [
    new Audio('audio/sfx/hookshot_hook.wav'),
    new Audio('audio/sfx/hookshot_shoot.wav'),
    new Audio('audio/sfx/hookshot_wall.wav'),
]



const musicPlayer = new Audio();

musicPlayer.loop = true;


window.onload = () => {

    (onMobile) ? mobileControls.style.display = "block": mobileControls.style.display = "none";
    setScene("game");

    world.loadLevel(level[3])


    player.posX = world.spawn.x;
    player.posY = world.spawn.y;

    camera.x = world.spawn.x - render.canvas.width / 2;
    camera.y = world.spawn.y - render.canvas.width / 2;


    render.attatchCamera(camera);
    //playMusic(1);
    setInterval(() => loop(), 1000 / 60);
    render.update();


}

window.onfocus = () => {
    sfx.forEach(sound => {
        sound.play();
        sound.pause();
        sound.currentTime = 0;
    })
}

/**
 * @param {Number} track index in music[]
 */
playMusic = (track) => {
    musicPlayer.src = music[track];
    musicPlayer.play();
}

/**
 * @param {Number} sound index in sfx[]
 */
playSound = (sound, loop = false) => {
    sfx[sound].loop = loop;
    sfx[sound].play();
}

stopSound = (sound) => {
    sfx[sound].pause();
    sfx[sound].currentTime = 0;
}

/**
 * @param {String} scene
 */
setScene = (scene) => {
    activeScene = scene;
    render.activeScene = scene;
}

function loop() {
    switch (activeScene) {
        case "game": {
            gameClock++;
            onScreen = world.tiles.filter((tile) => (
                tile.x > (camera.x - 32) && tile.x < (render.canvas.width + camera.x) &&
                tile.y > (camera.y - 32) && tile.y < (render.canvas.height + camera.y)
            ));

            nearPlayer = world.tiles.filter((tile) => (
                tile.x > (player.posX - 64) && tile.x < (player.posX + 32) &&
                tile.y > (player.posY - 64) && tile.y < (player.posY + 32)
            ));



            player.readInput(input);
            player.updatePos();
            world.update();
            camera.follow(player.posX + (player.velX * 5), player.posY + (player.velY * 5));



            //if(input.keys[input.binds.toggleDebug]) debug = !debug;

            //render.camera.follow(player.pos);

            //setScene("pauseMenu")
            if (input.keys[input.binds.pause]) setScene("pauseMenu");
            break;
        }
        case "pauseMenu": {
            menu.readInput(input);
            if (input.keys[input.binds.pause]) setScene("game");
            break;
        }

    }

}



var scenes = {
    menu: () => {


        // background


        //render.rectStatic(0, 0, render.canvas.width, render.canvas.height, '#000');


    },
    game: () => {

        render.clear();
        // background
        for (y = 0; y < canvasHeight + 64; y += 64) {
            for (x = 0; x < canvasWidth + 64; x += 64) {

                render.img(sprites.backgrounds.main, x + camera.x - (camera.x / 3) % 64, y + camera.y - (camera.y / 3) % 64, 64, 64);
            }
        }

        //render.rectStatic(0, 0, render.canvas.width, render.canvas.height, '#000');


        // player
        //render.line(player.posX, player.posY, player.activeEquipment.posX, player.activeEquipment.posY, "#fff")

        player.activeEquipment.draw();

        player.draw();

       // render.img(sprites.player.body[player.look], (player.posX - 16), (player.posY - 16), 32, 32);


/*
        if (player.midJump) render.img(sprites.player.bandsJump[Math.floor(player.band) % sprites.player.bandsJump.length], (player.posX - 16), (player.posY - 16) + 2);
        else render.img(sprites.player.bands[Math.floor((player.band) % sprites.player.bands.length)], (player.posX - 16), (player.posY - 16));
        */
        //render.img(player.activeGfx.bands[Math.floor(player.posX) % 8], player.posX - 16, player.posY - 16)




        // world
        onScreen.forEach(tile => {

            try {
                var texture = sprites.tiles[tile.type];

                (texture.length > 1) ? render.img(texture[gameClock % texture.length], tile.x, tile.y): render.img(texture, tile.x, tile.y);

            } catch {
                render.rect(tile.x, tile.y, tile.width, tile.height, '#fff');
            }
        })

        world.npcs.forEach(npc => npc.draw());


        render.pe.tick()

        //ui
        render.imgStatic(sprites.ui.label.hp, 16, 16);

        for (var i = 0; i < player.maxHp; i++) {
            var hp = (i < player.hp) ? 1 : 0;
            console.log(player.hp)
            if (i == 0) render.imgStatic(sprites.ui.statbar.left[hp], 32, 16);
            else if (i == player.maxHp - 1) render.imgStatic(sprites.ui.statbar.right[hp], 32 + (i * 16), 16)
            else render.imgStatic(sprites.ui.statbar.mid[hp], 32 + (i * 16), 16);
        }


        //debug
        if (debug) {
            //render.rectStatic(0, render.canvas.height / 2, render.canvas.width, 1, '#f00');
            //render.rectStatic(render.canvas.width / 2, 0, 1, render.canvas.height, '#0f0');

            var hb = player.hitbox;

            render.rectStroke(hb.x.left(), hb.y.top(), hb.x.right() - hb.x.left(), hb.y.bottom() - hb.y.top(), "#ff0");

            render.rectStroke(hb.x.left(), hb.x.top(), hb.x.right() - hb.x.left(), hb.x.bottom() - hb.x.top(), "#f00");
            render.rectStroke(hb.y.left(), hb.y.top(), hb.y.right() - hb.y.left(), hb.y.bottom() - hb.y.top(), "#0f0");

            render.rectStroke((player.posX - 32), (player.posY - 32) - Math.abs(player.velY), 64, 64 + Math.abs(player.velY), "#00f")

            onScreen.forEach(tile => {
                render.rectStroke(tile.x, tile.y, tile.width, tile.height, "#f00");
            })

            nearPlayer.forEach(tile => {
                render.rectStroke(tile.x, tile.y, tile.width, tile.height, "#0f0")
            })



            var playerInfo = JSON.stringify(player).split(',');

            render.rectStatic(6, 6, 160, (playerInfo.length * 12) + 12, "#11111180");
            playerInfo.forEach((row, i) => {
                render.text(row, 12, (i * 12) + 12, 0, "#fff");
            });
            //render.line(player.posX, player.posY, player.posX + (player.velX) + player.hitbox.padding, player.posY + (player.velY) + player.hitbox.padding, "#ff0")
        }

    },
    pauseMenu: () => {
        menu.draw();
    }
}