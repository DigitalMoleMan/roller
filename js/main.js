/**
 * Roller - main.js
*/

var debug = false;

const mainDOM = document.getElementById("main");
const canvasContainer = document.getElementById("canvasContainer");


//Mobile

var onMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);



//let menu = new Menu();

lastIndex = (array) => array.length - 1;

randomIndex = (array) => array[Math.round(Math.random() * lastIndex(array))];

var canvasWidth = 1024;
var canvasHeight = 576;

if (onMobile) {
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
}

let render = new Renderer(canvasWidth, canvasHeight);
let input = new Input({ //Binds
    game: {
        //movement
        up: 'arrowup',
        down: 'arrowdown',
        left: 'a',
        right: 'd',

        //actions
        jump: ' ',
        sprint: 'shift',
        use: 'n',

        //hotkeys
        prevItem: 'arrowleft',
        nextItem: 'arrowright',

        //misc
        togglePause: 'p',

        //dev
        toggleDebug: 'f',
    },
    pauseMenu: {
        togglePause: 'p'
    }
});

let menu = new Menu();
let world = new World();
let player = new Player();
let camera = new Camera();
let lighting = new LightingEngine();
let particleEng = new ParticleEngine();

var gameClock = 0;
var activeScene
var nearPlayer = [];
var onScreen = [];
var onScreenSegs = [];
var onScreenLights = [];

//Loading sprites
var sprites = {
    ui: {
        hp: {
            label: render.importImage('img/ui/hp/label.png'),
            statbar: {
                left: render.importImage('img/ui/hp/statbar_left.png'),
                right: render.importImage('img/ui/hp/statbar_right.png'),
                mid: render.importImage('img/ui/hp/statbar_mid.png'),
                point: render.importImage('img/ui/hp/point.png'),
            },
        },
        activeItem: {
            label: render.importImage('img/ui/activeItem/label.png'),
            border: render.importImage('img/ui/activeItem/border.png'),
            bar: render.importImage('img/ui/activeItem/bar.png'),
            //items
            hookshot: render.importImage('img/ui/activeItem/hookshot.png'),
            booster: render.importImage('img/ui/activeItem/booster.png'),
        }
    },
    player: {
        body: render.importSprite('img/player/body', 13),
        bands: render.importSprite('img/player/bands', 8),
        bandsJump: render.importSprite('img/player/bands_jump', 8),
        cannon: render.importSprite('img/player/cannon', 13),
        hookshot: render.importSprite('img/player/hookshot', 8),
        equipment: {
            booster: {
                inactive: render.importImage('img/player/equipment/booster/inactive.png'),
                active: render.importSprite('img/player/equipment/booster/active', 3),
                cooldown: render.importImage('img/player/equipment/booster/cooldown.png'),
            }
        }
    },
    tiles: {
        "@": render.importImage('img/tiles/break_block_0.png'),
        "X": render.importSprite('img/tiles/block/block', 16),
        "-": render.importImage('img/tiles/platform.png'),
        "^": render.importSprite('img/tiles/elevator', 8),
        "v": render.importSprite('img/tiles/elevator', 8),
        "<": render.importSprite('img/tiles/elevator', 8),
        ">": render.importSprite('img/tiles/elevator', 8),
        "M": render.importImage('img/tiles/spikes_floor.png'),
        "W": render.importImage('img/tiles/spikes_roof.png'),
        "G": render.importImage('img/tiles/hookpoint.png'),
        "L": render.importImage('img/tiles/lamp.png'),
        "¤": render.importSprite('img/tiles/cog', 4),


        //"#": render.importImage('img/tiles/break_block', 2),
    },
    npcs: {
        enemies: {
            roamer: render.importSprite('img/npcs/enemies/roamer/roamer', 6),
            spikeGuard: render.importSprite('img/npcs/enemies/spike_guard/body_idle', 6),
            laserTurret: {
                base: render.importImage('img/npcs/enemies/laser_turret/base.png'),
                arm: render.importImage('img/npcs/enemies/laser_turret/arm.png'),
                laser: render.importImage('img/npcs/enemies/laser_turret/laser.png'),
            }
        },
        bogus: {
            idle: render.importSprite('img/npcs/bogus/idle', 5)
        }
    },
    backgrounds: [
        render.importImage('img/backgrounds/main.png'),
        render.importImage('img/backgrounds/main2.png'),
        render.importImage('img/backgrounds/metal_bg.png'),
        render.importImage('img/backgrounds/metal.png')
    ],
}

var pattern = [];

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

var sfx = {
    player: {
        hurt: [
            new Audio('audio/sfx/player/hurt_0.wav'),
            new Audio('audio/sfx/player/hurt_1.wav'),
            new Audio('audio/sfx/player/hurt_2.wav'),
        ]
    },
    items: {
        hookshot: {
            hook: new Audio('audio/sfx/hookshot_hook.wav'),
            shoot: new Audio('audio/sfx/hookshot_shoot.wav'),
            wall: new Audio('audio/sfx/hookshot_wall.wav'),
        }
    }
}


const musicPlayer = new Audio();




musicPlayer.loop = true;


window.onload = () => {

    if ('serviceWorker' in navigator) {
        var swURL = './sw.js';
        navigator.serviceWorker.register(swURL).then((registration) => console.log('ServiceWorker registration successful with scope: ', registration.scope),
            (err) => console.log('ServiceWorker registration failed: ', err));
    }

    music.forEach(track => {
        musicPlayer.src = track;
        musicPlayer.play();  
    })
    musicPlayer.pause();

    setScene("game");

    world.loadLevel(level[0])


    sprites.backgrounds.forEach(bg => pattern.push(render.toPattern(bg)));


    player.posX = world.spawn.x;
    player.posY = world.spawn.y;

    camera.x = world.spawn.x - render.canvas.width / 2;
    camera.y = world.spawn.y - render.canvas.width / 2;


    render.attatchCamera(camera);

    document.addEventListener(input.binds[activeScene].togglePause, () => { if (input.keys[input.binds[activeScene].togglePause] !== true) (activeScene == "game") ? setScene("pauseMenu") : setScene("game") });
    // playMusic(10);
    setInterval(() => loop(), 1000 / 60);
    render.update();


}

initSounds = () => {
    sfx.forEach(sound => {
        var promise = sound.play();
        if (promise !== undefined) {
            promise.then(_ => {

            }).catch(error => {
                console.log(error);
            })
        }
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
playSound = (sound) => (sound.length == undefined) ? sound.play() : randomIndex(sound).play();

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
    if (onMobile) input.readMobileInput();
    switch (activeScene) {
        case "game": {


            gameClock++;

            onScreen = world.tiles.filter((tile) => (
                tile.x > (camera.x - 32) && tile.x < (render.canvas.width + camera.x) &&
                tile.y > (camera.y - 32) && tile.y < (render.canvas.height + camera.y)
            ));

            onScreenSegs = world.segments.filter((tile) => (
                (camera.x - (canvasWidth / 2)) < tile.x + tile.width &&
                (camera.x + canvasWidth + (canvasWidth / 2)) > tile.x &&
                (camera.y - (canvasHeight / 2)) < tile.y + tile.height &&
                (camera.y + canvasHeight + (canvasHeight / 2)) > tile.y
            ));

            onScreenLights = world.lightSources.filter((tile) => (
                (camera.x - (canvasWidth)) < tile.x + tile.radius &&
                (camera.x + canvasWidth + (canvasWidth)) > tile.x - tile.radius &&
                (camera.y - (canvasHeight)) < tile.y + tile.radius &&
                (camera.y + canvasHeight + (canvasHeight)) > tile.y - tile.radius
            ));

            nearPlayer = world.segments.filter((tile) => (
                player.posX - 32 < tile.x + tile.width &&
                player.posX + 32 > tile.x &&
                player.posY - 32 < tile.y + tile.height &&
                player.posY + 32 > tile.y
            ));

            world.update();

            player.readInput(input);
            player.updatePos();

            camera.follow(player.posX + (player.velX * 5), player.posY + (player.velY * 5));

            lighting.update();


            //render.camera.follow(player.pos);
            break;
        }
        case "pauseMenu": {
            menu.readInput(input);
            //if (input.keys[input.binds.pause]) setScene("game");
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

        const static = 0;

        render.clear();
        // background


        var bg = sprites.backgrounds[3];
        for (var y = 0; y < (canvasHeight * 3); y += (bg.height * 2)) {
            for (var x = 0; x < (canvasWidth * 3); x += (bg.width * 2)) {
                render.img(bg, x - ((camera.x) % (bg.width * 4)), y - ((camera.y) % (bg.height * 4)), 0, 2);
            }
        }


        world.npcs.forEach(npc => npc.draw());

        player.draw();



        // world
        //render.ctx.save();
        //render.ctx.scale(2, 2);
        onScreen.filter((tile) => tile.type !== "X").forEach(tile => {


            try {
                render.ctx.save();
                var texture = sprites.tiles[tile.type];

                if (tile.drawModifier !== undefined) tile.drawModifier();


                (texture.length > 1) ? render.img(texture[Math.floor((gameClock) % texture.length)], tile.x, tile.y, 1) : render.img(texture, tile.x, tile.y, 1);
                render.ctx.restore();
            } catch (error) {
                render.rect(tile.x, tile.y, tile.width, tile.height, '#fff', 1);
            }

        })

        onScreenSegs.filter((seg) => seg.type == "X").forEach(tile => {

            render.ctx.save();
            var texture = tile.texture;

            // if(tile.drawModifier !== undefined)tile.drawModifier();


            render.img(texture, tile.x, tile.y, 1);
            render.ctx.restore();

        })


        //render.ctx.restore();






        render.pe.tick()


        lighting.draw();


        //ui
        var hpUi = sprites.ui.hp;

        render.ctx.save();
        render.ctx.translate(-hpUi.label.width, static);

        render.img(hpUi.label, 48, 16, 0);
        render.ctx.restore();

        for (var i = 0; i < player.maxHp; i++) {
            if (i == 0) render.img(hpUi.statbar.left, 48, 16, static);
            else if (i == player.maxHp - 1) render.img(hpUi.statbar.right, 48 + (i * 16), 16, static)
            else render.img(hpUi.statbar.mid, 48 + (i * 16), 16, static);
        }

        for (var i = 0; i < player.hp; i++) {
            render.img(hpUi.statbar.point, 52 + (12 * i), 16, static)
        }



        var itemUi = sprites.ui.activeItem;
        render.ctx.save();
        render.ctx.translate(-itemUi.label.width, 0);

        render.img(itemUi.label, 48, 32, static);

        render.ctx.restore();
        render.img(itemUi.border, 48, 32, static);

        render.img(itemUi[player.activeItem.name], 48, 32, static);




    },
    pauseMenu: () => {
        scenes.game();
        menu.draw();
    }


}

drawDebug = () => {
    //debug
    //render.rectStatic(0, render.canvas.height / 2, render.canvas.width, 1, '#f00');
    //render.rectStatic(render.canvas.width / 2, 0, 1, render.canvas.height, '#0f0');

    var hb = player.hitbox;

    //ctx.setTransform(1,0,0,1,0,0)

    //render.rectStroke(hb.x.left(), hb.y.top(), hb.x.right() - hb.x.left(), hb.y.bottom() - hb.y.top(), "#ff0");

    render.rectStroke(hb.x.left(), hb.x.top(), hb.x.right() - hb.x.left(), hb.x.bottom() - hb.x.top(), "#f00");
    render.rectStroke(hb.y.left(), hb.y.top(), hb.y.right() - hb.y.left(), hb.y.bottom() - hb.y.top(), "#0f0");

    //render.rectStroke((player.posX - 32), (player.posY - 32), 64, 64, "#00f")

    world.segments.forEach(seg => render.rectStroke(seg.x, seg.y, seg.width, seg.height, "#f00"))
    /*
                onScreen.forEach(tile => {
                    render.rectStroke(tile.x, tile.y, tile.width, tile.height, "#f00");
                })
    */
    nearPlayer.forEach(tile => {
        render.rectStroke(tile.x, tile.y, tile.width, tile.height, "#0f0")
    })


    if (true) {
        var playerInfo = JSON.stringify(player).split(',');

        render.rectStatic(6, 6, 160, (playerInfo.length * 12) + 12, "#11111180");
        playerInfo.forEach((row, i) => {
            render.text(row, 12, (i * 12) + 12, 0, "#fff");
        });
    }

    if (onMobile) {
        var ta = input.touchAreas[activeScene];
        for (var i = 0; i < ta.length; i++) {
            render.rectStroke(ta[i].x, ta[i].y, ta[i].width, ta[i].height, "#ffffff80", 2, 0);
            render.text(ta[i].bind, ta[i].x + (ta[i].width / 2), ta[i].y + (ta[i].height / 2), 0, "#ffffff80");
        }
    }
    //render.line(player.posX, player.posY, player.posX + (player.velX) + player.hitbox.padding, player.posY + (player.velY) + player.hitbox.padding, "#ff0")
}