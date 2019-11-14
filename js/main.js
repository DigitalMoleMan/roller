/**
 * Roller - main.js
*/

var settings = {
    graphics: {
        enableLighting: true
    },
    misc: {
        halloweenMode: false,
        enableCache: false,
        gameLoopMethod: 'raf',
        debugMode: false
    }
}

//halloween event
var hwQuest = {
    started: false,
    candiesCollected: 0,
    candiesToComplete: 10,
    fadeout: 0
}

getBrowserName = () => {
    let browserName = '';
    try {
        var ua = navigator.userAgent.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i)
        if (navigator.userAgent.match(/Edge/i) || navigator.userAgent.match(/Trident.*rv[ :]*11\./i)) browserName = "msie"
        else browserName = ua[1].toLowerCase();
    } catch {
        browserName = 'unknown';
    }
    return browserName;
}

var browser = getBrowserName();

var onMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

lastIndex = (array) => array.length - 1;

randomIndex = (array) => array[Math.round(Math.random() * lastIndex(array))];

var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;

let render = new Renderer(canvasWidth, canvasHeight);

let input = new Input(
    { //Binds
        global: {
            toggleDebug: 'KeyF',
        },
        game: {
            //movement
            up: 'ArrowUp',
            down: 'ArrowDown',
            left: 'ArrowLeft',
            right: 'ArrowRight',

            //actions
            jump: 'Space',
            // sprint: 'ShiftLeft',
            use: 'KeyD',
            interact: 'KeyE',

            //hotkeys
            prevItem: 'ArrowLeft',
            nextItem: 'ArrowRight',

            //misc
            togglePause: 'KeyP',

            //dev
            toggleDebug: 'KeyF',
        },
        gameDialogue: {
            next: 'Space',
            //misc
            togglePause: 'KeyP',
            toggleDebug: 'KeyF',
        },
        pauseMenu: {
            togglePause: 'KeyP',
            toggleDebug: 'KeyF',
            up: 'KeyW',
            down: 'KeyS'
        }
    });

let menu = new Menu();
let world = new World();
let player = new Player();
let camera = new Camera();
let dialogue = new DialogueHandler();
let lighting = new LightingEngine();
let particleEng = new ParticleEngine();

var gameClock = 0;
var activeScene
var nearPlayer = [];
var onScreen = [];
var onScreenSegs = [];
var onScreenLights = [];

const fontFile = new SpriteSheet('fonts/roller_font.png', 8, 8);


var font = [];

var sprites = {
    ui: {
        hp: {
            label: render.importImage('img/ui/hp/label.png'),
            left: render.importImage('img/ui/hp/statbar_left.png'),
            right: render.importImage('img/ui/hp/statbar_right.png'),
            mid: render.importImage('img/ui/hp/statbar_mid.png'),
            point: render.importImage('img/ui/hp/point.png'),
        },
        activeItem: {
            label: render.importImage('img/ui/activeItem/label.png'),
            border: render.importImage('img/ui/activeItem/border.png'),
            bar: render.importImage('img/ui/activeItem/bar.png'),
            //items
            hookshot: render.importImage('img/ui/activeItem/hookshot.png'),
            booster: render.importImage('img/ui/activeItem/booster.png'),
        },
        dialogueBox: {
            left: render.importImage('img/ui/dialogue_box/border_left.png'),
            right: render.importImage('img/ui/dialogue_box/border_right.png'),
            middle: render.importImage('img/ui/dialogue_box/border_middle.png')
        }
    },
    player: {
        body: new SpriteSheet('img/player/body_sheet.png', 32, 32),
        bands: new SpriteSheet('img/player/bands_sheet.png', 32, 32),
        bandsJump: new SpriteSheet('img/player/bands_jump_sheet.png', 32, 32),
        bandsFall: new SpriteSheet('img/player/bands_fall_sheet.png', 32, 32),
        bandsMeteor: new SpriteSheet('img/player/bands_meteor_sheet.png', 32, 32),
        cannon: render.importSprite('img/player/cannon', 13),
    },
    items: {
        hookshot: {
            hook: render.importSprite('img/player/hookshot', 8),
            recticle: render.importImage('img/ui/hookshot_recticle.png')
        },
        booster: {
            inactive: render.importImage('img/player/equipment/booster/inactive.png'),
            active: render.importSprite('img/player/equipment/booster/active', 3),
            cooldown: render.importImage('img/player/equipment/booster/cooldown.png'),
        }
    },
    tiles: {
        block: {
            metal: new SpriteSheet('img/tiles/block/block_metal_sheet.png', 16, 16),
            dirt: render.importSprite('img/tiles/block/dirt', 16),
            alt_metal: render.importSprite('img/tiles/block/alt_metal', 16),
            alt_dirt: render.importSprite('img/tiles/block/alt_dirt', 0),
        },
        platform: render.importImage('img/tiles/platform.png'),
        elevator: render.importSprite('img/tiles/elevator', 8),
        spikes: {
            metal_up: render.importImage('img/tiles/spikes_floor.png'),
            metal_down: render.importImage('img/tiles/spikes_roof.png'),
        },
        hookpoint: render.importImage('img/tiles/hookpoint.png'),
        "L": render.importImage('img/tiles/lamp.png'),
        pumpkin: render.importImage('img/tiles/pumpkin.png'),
        candy: render.importImage('img/tiles/candy.png')
    },
    npcs: {
        enemies: {
            roamer: render.importSprite('img/npcs/enemies/roamer/roamer', 6),
            spikeGuard: {
                idle: render.importSprite('img/npcs/enemies/spike_guard/body_idle', 6),
                hw: render.importImage('img/npcs/enemies/spike_guard/hw.png')
            },
            laserTurret: {
                base: render.importImage('img/npcs/enemies/laser_turret/base.png'),
                arm: render.importImage('img/npcs/enemies/laser_turret/arm.png'),
                laser: render.importImage('img/npcs/enemies/laser_turret/laser.png'),
            }
        },
        bogus: {
            idle: render.importSprite('img/npcs/bogus/idle', 10),
            hw_anim: render.importImage('img/npcs/bogus/hw_anim.png')
        },
        hwSign: render.importImage('img/npcs/hw_sign.png')

    },
    backgrounds: [
        render.importImage('img/backgrounds/main.png'),
        render.importImage('img/backgrounds/main2.png'),
        render.importImage('img/backgrounds/metal_bg.png'),
        render.importImage('img/backgrounds/metal.png'),
        render.importImage('img/backgrounds/halloween.png'),
        render.importImage('img/backgrounds/halloween_sky.png')
    ],
}

var pattern = [];

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
    'audio/music/the beatdown.wav',
    'audio/music/a scary robot this way comes.wav',
    'audio/music/spook time.wav'
];

var sfx = {
    player: {
        movement: {
            jump: new Audio('audio/sfx/player/jump.wav'),
            landing: new Audio('audio/sfx/player/landing.wav'),
            rolling: new Audio('audio/sfx/player/rolling.wav'),
        },

        feedback: {
            hurt: new Audio('audio/sfx/player/hurt_0.wav')
        }
    },
    items: {
        hookshot: {
            hook: new Audio('audio/sfx/hookshot_hook.wav'),
            shoot: new Audio('audio/sfx/hookshot_shoot.wav'),
            wall: new Audio('audio/sfx/hookshot_wall.wav'),
        }
    },
    tiles: {
        candy: {
            collect: new Audio('audio/sfx/hw_candy.wav')
        }
    },
    ui: {
        dialogue: {
            next: new Audio('audio/sfx/tick.wav'),
            text: new Audio('audio/sfx/text.wav')
        }
    },
    npcs: {
        bogus: {
            lightning: new Audio('audio/sfx/lightning.wav'),
            startup: new Audio('audio/sfx/hw_startup.wav'),
        }
    }
}

if (settings.misc.halloweenMode) {
    sprites.player.body = render.importSprite('img/player/hw_body', 13)
    sprites.npcs.bogus.boogus = render.importSprite('img/npcs/bogus/hw_idle', 10)
}


const musicPlayer = new Audio();
musicPlayer.volume = .1;
musicPlayer.loop = true;

document.addEventListener(input.binds["global"].toggleDebug, () => settings.misc.debugMode = !settings.misc.debugMode);


let musicDuration = 1;
/**
 * @param {Number} track index in music[]
 */
playMusic = (track) => {
    musicPlayer.src = music[track];
    musicPlayer.currentTime = 0;
    musicPlayer.play();

    musicDuration = musicPlayer.duration;
}

/**
 * @param {Number} sound index in sfx[]
 */
playSound = (sound, volume = .5) => {

    sound.volume = volume;
    (sound.length == undefined) ? sound.play() : randomIndex(sound).play();
}

loopSound = (sound) => {
    if (sound.currentTime >= sound.duration - .1) sound.currentTime = 0;

    sound.play();
}

stopSound = (sound) => {
    sound.pause();
    if (sound.currentTime) sound.currentTime = 0;
}

/**
 * @param {Scene} scene
 */
setScene = (scene) => {
    activeScene = scene;
}

initServiceWorker = () => {
    if ('serviceWorker' in navigator) {
        var swURL = './sw.js';
        navigator.serviceWorker.register(swURL).then((registration) => console.log('ServiceWorker registration successful with scope: ', registration.scope),
            (err) => console.log('ServiceWorker registration failed: ', err));
    }
}

window.onload = () => {

    if (settings.misc.enableCache) initServiceWorker();

    musicPlayer.addEventListener('canplay', () => {
        for (let category in sfx) {
            for (subCategory in sfx[category]) {
                for (audio in sfx[category][subCategory]) {
                    let sound = sfx[category][subCategory][audio];
                    sound.play()
                    sound.pause()
                }
            }
        }
    }, {
        once: true,
        passive: true
    })

    loadDialogues();


    if (settings.misc.halloweenMode) {
        settings.graphics.enableLighting = false;
        world.loadLevel(level[9]);
    } else world.loadLevel(level[1]);


    setScene("game");


    player.posX = world.spawn.x;
    player.posY = world.spawn.y;

    camera.x = world.spawn.x - render.canvas.width / 2;
    camera.y = world.spawn.y - render.canvas.width / 2;


    render.attatchCamera(camera);

    dialogue.playDialogue(rollerDialogues[0]);

    document.addEventListener(input.binds["game"].togglePause, () => {
        if (input.keys[input.binds[activeScene].togglePause] !== true) (activeScene == "game") ? setScene("pauseMenu") : setScene("game")
    });
    //playMusic(14);

    //setInterval(() => intervalUpdate(), 1000 / 60);
    settings.misc.gameLoopMethod = 'raf'
    switch (settings.misc.gameLoopMethod) {
        case 'interval': setInterval(() => loop(Date.now()), 1000 / 60); break;
        case 'raf': loop(0); break;
        default: setInterval(() => loop(), 1000 / 60);
    }
    //render.update();
}

var deltaTime = 0;
var previous = 0;

function loop(time) {
    requestAnimationFrame(loop);

    if (previous == 0) previous = time - 1;
    deltaTime = ((time - previous) / 16);



    previous = time;

    if (deltaTime < 1.5) {
        if (onMobile) input.readMobileInput();
        scenes[activeScene].update();
        scenes[activeScene].draw();
        if (settings.misc.debugMode) drawDebug();

        if (musicPlayer.currentTime >= musicDuration) musicPlayer.currentTime = 0;
    }
}

window.onresize = () => {
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    render.renewCanvas();
}

class Background {
    constructor(parts, drawFunction) {
        this.parts = parts;
        this.draw = () => drawFunction(parts);
    }
}

let metalBackground = new Background([sprites.backgrounds[3]], (parts) => {
    let bg = parts[0];

    for (var y = 0; y < (canvasHeight * 3); y += (bg.height * 2)) {
        for (var x = 0; x < (canvasWidth * 3); x += (bg.width * 2)) {
            render.img(bg, x - ((camera.x) % (bg.width * 4)), y - ((camera.y) % (bg.height * 4)), 0, 2);
        }
    }
})

let hwBackground = new Background([sprites.backgrounds[4], sprites.backgrounds[5]], (parts) => {
    let bg = parts[0];
    let bg2 = parts[1];
    for (let x = 0; x < (canvasWidth); x += bg.width) {
        for (let y = 0; y < (canvasHeight * 2); y += bg.height * 2) {
            render.img(bg2, x + camera.x, y + camera.y, 1.1);
        }
        render.img(bg, (x - ((camera.x / 5) % (bg.width))), (canvasHeight - (bg.height)) + (((world.height - canvasHeight) - camera.y) / 10), 0);
    }
})

class Scene {
    constructor(update, draw) {
        this.update = () => update();
        this.draw = () => draw();
    }
}

var scenes = {
    menu: new Scene(() => { // update

    }, () => { // draw
        // background
        //render.rectStatic(0, 0, render.canvas.width, render.canvas.height, '#000');
    }),
    game: new Scene(() => { // update

        gameClock += deltaTime

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

        world.update();

        player.readInput(input);
        player.update();

        camera.follow(player.posX + (player.velX * 5), player.posY + (player.velY * 5));



    }, () => { // draw

        const zero = 0;
        // background
        render.rect(0, 0, canvasWidth, canvasHeight, '#181425', 0);

        hwBackground.draw();

        world.npcs.forEach(npc => npc.draw());


        player.draw();



        // world
        for (let tile of onScreen) tile.draw()

        for (let tile of onScreenSegs.filter((seg) => seg.type == "block")) tile.draw();
        render.particleEngine.update()


        if (deltaTime < 1.1) {
            lighting.update();
        }
        lighting.draw();




        //ui
        let hpUi = sprites.ui.hp;

        render.ctx.save();
        render.ctx.translate(-hpUi.label.width, zero);

        render.img(hpUi.label, 48, 16, 0);
        render.ctx.restore();

        for (var i = 0; i < player.maxHp; i++) {
            if (i == 0) render.img(hpUi.left, 48, 16, zero);
            else if (i == player.maxHp - 1) render.img(hpUi.right, 48 + (i * 16), 16, zero)
            else render.img(hpUi.mid, 48 + (i * 16), 16, zero);
        }

        for (var i = 0; i < player.hp; i++) render.img(hpUi.point, 52 + (12 * i), 16, zero)

        if (world.inRangeActors.length > 0 && activeScene == 'game') {
            let actor = world.inRangeActors[0]

            render.text('E', actor.posX + (actor.interactionRadius / 2.5), actor.posY - block(), 1, "#fff", 1);
        }

        var itemUi = sprites.ui.activeItem;
        render.ctx.save();
        render.ctx.translate(-itemUi.label.width, 0);

        render.img(itemUi.label, 48, 32, zero);

        render.ctx.restore();
        render.img(itemUi.border, 48, 32, zero);

        render.img(itemUi[player.activeItem.name], 48, 32, zero);
    }),
    gameDialogue: new Scene(() => { // update
        gameClock += deltaTime;

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

        world.update();


        camera.follow(dialogue.currentDialogue.camPosX(), dialogue.currentDialogue.camPosY());

        dialogue.update();


    }, () => { // draw
        scenes.game.draw();
        dialogue.draw();

    }),
    pauseMenu: new Scene(() => { // update

        menu.update();
    }, () => { // draw
        scenes.game.draw();
        menu.draw();
    })
}

drawDebug = () => {

    var hb = player.hitbox;
    render.rectStroke(hb.x.left(), hb.x.top(), hb.x.right() - hb.x.left(), hb.x.bottom() - hb.x.top(), "#f00");
    render.rectStroke(hb.y.left(), hb.y.top(), hb.y.right() - hb.y.left(), hb.y.bottom() - hb.y.top(), "#0f0");

    for (let seg of world.segments) render.rectStroke(seg.x, seg.y, seg.width, seg.height, "#f00");

    for (let tile of nearPlayer) render.rectStroke(tile.x, tile.y, tile.width, tile.height, "#0f0");


    if (true) {
        let playerInfo = JSON.stringify(player).split(',');

        render.rect(0, 0, 160, (playerInfo.length * 12) + 12, "#11111180", 0);
        render.ctx.fillStyle = "#fff";
        render.ctx.font = "12px monospace"
        for (let i in playerInfo) render.ctx.fillText(playerInfo[i], 12, (i * 12) + 12);
    }

    if (onMobile) {
        for (let ta of input.touchAreas[activeScene]) {
            render.rectStroke(ta.x(), ta.y(), ta.width(), ta.height(), "#ffffff80", 2, 0);
            render.text(ta.bind, ta.x(), ta.y(), 1, "#ffffff80");
        }
    }

}


