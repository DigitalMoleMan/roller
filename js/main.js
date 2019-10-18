/**
 * Roller - main.js
*/

var debug = false;

const mainDOM = document.getElementById("main");


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

let input = new Input(
    { //Binds
        global: {
            toggleDebug: 'KeyF',
        },
        game: {
            //movement
            up: 'ArrowUp',
            down: 'ArrowDown',
            left: 'KeyA',
            right: 'KeyD',

            //actions
            jump: 'Space',
            sprint: 'ShiftLeft',
            use: 'KeyN',
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
    }, {
        game: [
            {
                bind: "left",
                x: block(0),
                y: block(2),
                width: block(5),
                height: canvasHeight - block(2)
            },
            {
                bind: "right",
                x: block(5),
                y: block(2),
                width: block(5),
                height: canvasHeight - block(2)
            },
            {
                bind: "jump",
                x: canvasWidth - block(5),
                y: block(0),
                width: block(5),
                height: canvasHeight
            },
            {
                bind: "use",
                x: canvasWidth - block(10),
                y: block(0),
                width: block(5),
                height: canvasHeight
            },
            {
                bind: "togglePause",
                x: block(1),
                y: block(0),
                width: block(2),
                height: block(2)
            }
        ],
        gameDialogue: [
            {
                bind: "next",
                x: block(0),
                y: block(0),
                width: canvasWidth,
                height: canvasHeight
            }
        ],
        pauseMenu: [
            {
                bind: "togglePause",
                x: block(1),
                y: block(0),
                width: block(2),
                height: block(2)
            }
        ]
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

const fontFile = new Image();


var font = [];

fontFile.onload = () => {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext("2d");
    canvas.width = 16;
    canvas.height = 16;
    ctx.imageSmoothingEnabled = false;
    ctx.scale(2, 2);
    for (var i = 0; i < fontFile.width; i += 8) {
        ctx.clearRect(0, 0, 16, 16);
        ctx.drawImage(fontFile, -i, 0);
        var char = new Image();
        char.src = canvas.toDataURL();
        font.push(char);
    }
}

fontFile.src = 'fonts/roller_font.png';

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
        },
        dialogueBox: {
            tl: render.importImage('img/ui/dialogue_box/db_tl.png'),
            tm: render.importImage('img/ui/dialogue_box/db_tm.png'),
            tr: render.importImage('img/ui/dialogue_box/db_tr.png'),
            ml: render.importImage('img/ui/dialogue_box/db_ml.png'),
            mr: render.importImage('img/ui/dialogue_box/db_mr.png'),
            bl: render.importImage('img/ui/dialogue_box/db_bl.png'),
            bm: render.importImage('img/ui/dialogue_box/db_bm.png'),
            br: render.importImage('img/ui/dialogue_box/db_br.png'),
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
            idle: render.importSprite('img/npcs/bogus/idle', 10)
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
    'audio/music/the beatdown.wav'
];

var sfx = {
    player: {
        jump: new Audio('audio/sfx/player/jump.wav'),
        landing: new Audio('audio/sfx/player/landing.wav'),
        rolling: new Audio('audio/sfx/player/rolling.wav'),
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
    },
    ui: {
        dialogue: {
            next: new Audio('audio/sfx/tick.wav'),
            text: new Audio('audio/sfx/text.wav')
        }
    }
}


const musicPlayer = new Audio();
musicPlayer.volume = .1;
musicPlayer.loop = true;

document.addEventListener(input.binds["global"].toggleDebug, () => debug = !debug);

window.onload = () => {

    if ('serviceWorker' in navigator) {
        var swURL = './sw.js';
        navigator.serviceWorker.register(swURL).then((registration) => console.log('ServiceWorker registration successful with scope: ', registration.scope),
            (err) => console.log('ServiceWorker registration failed: ', err));
    }

    loadDialogues();
    world.loadLevel(level[0]);


    setScene("game");


    player.posX = world.spawn.x;
    player.posY = world.spawn.y;

    camera.x = world.spawn.x - render.canvas.width / 2;
    camera.y = world.spawn.y - render.canvas.width / 2;


    render.attatchCamera(camera);

    dialogue.playDialogue(rollerDialogues[0]);

    document.addEventListener(input.binds["game"].togglePause, () => { if (input.keys[input.binds[activeScene].togglePause] !== true) (activeScene == "game") ? setScene("pauseMenu") : setScene("game") });
    //playMusic(10);
    setInterval(() => loop(), 1000 / 60);
    //render.update();


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
playSound = (sound) => {
    sound.currentTime = 0;
    (sound.length == undefined) ? sound.play() : randomIndex(sound).play();
}

loopSound = (sound) => {
    if (sound.currentTime >= sound.duration - .1) sound.currentTime = 0;
    sound.play();
}
 
stopSound = (sound) => {
    sound.pause();
    sound.currentTime = 0;
}

/**
 * @param {Scene} scene
 */
setScene = (scene) => {
    activeScene = scene;
    render.activeScene = scene;
}
function loop() {
    if (musicPlayer.currentTime >= (musicPlayer.duration)) musicPlayer.currentTime = 0
    scenes[activeScene].update();
    scenes[activeScene].draw();

    if (debug) drawDebug();
}

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
        if (onMobile) input.readMobileInput();
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

    }, () => { // draw

        const zero = 0;

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
        render.ctx.translate(-hpUi.label.width, zero);

        render.img(hpUi.label, 48, 16, 0);
        render.ctx.restore();

        for (var i = 0; i < player.maxHp; i++) {
            if (i == 0) render.img(hpUi.statbar.left, 48, 16, zero);
            else if (i == player.maxHp - 1) render.img(hpUi.statbar.right, 48 + (i * 16), 16, zero)
            else render.img(hpUi.statbar.mid, 48 + (i * 16), 16, zero);
        }

        for (var i = 0; i < player.hp; i++) {
            render.img(hpUi.statbar.point, 52 + (12 * i), 16, zero)
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
        if (onMobile) input.readMobileInput();
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

        player.updatePos();

        camera.follow(dialogue.currentDialogue.camPosX(), dialogue.currentDialogue.camPosY());

        lighting.update();

        //if (input.keys[input.binds.gameDialogue.next] && dialogue.currentDialogue.text.length == dialogue.textProg) dialogue.currentDialogue.next();

        dialogue.update();


    }, () => { // draw

        const zero = 0;

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

        dialogue.draw();
        //ui
        var hpUi = sprites.ui.hp;

        render.ctx.save();
        render.ctx.translate(-hpUi.label.width, zero);

        render.img(hpUi.label, 48, 16, 0);
        render.ctx.restore();

        for (var i = 0; i < player.maxHp; i++) {
            if (i == 0) render.img(hpUi.statbar.left, 48, 16, zero);
            else if (i == player.maxHp - 1) render.img(hpUi.statbar.right, 48 + (i * 16), 16, zero)
            else render.img(hpUi.statbar.mid, 48 + (i * 16), 16, zero);
        }

        for (var i = 0; i < player.hp; i++) {
            render.img(hpUi.statbar.point, 52 + (12 * i), 16, zero)
        }



        var itemUi = sprites.ui.activeItem;
        render.ctx.save();
        render.ctx.translate(-itemUi.label.width, 0);

        render.img(itemUi.label, 48, 32, zero);

        render.ctx.restore();
        render.img(itemUi.border, 48, 32, zero);

        render.img(itemUi[player.activeItem.name], 48, 32, zero);




    }),
    pauseMenu: new Scene(() => { // update
        if (onMobile) input.readMobileInput();

        menu.update();
        //if (input.keys[input.binds.pause]) setScene("game");
    }, () => { // draw
        scenes.game.draw();
        menu.draw();
    })
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


    if (!true) {
        var playerInfo = JSON.stringify(player).split(',');

        render.rectStatic(6, 6, 160, (playerInfo.length * 12) + 12, "#11111180");
        playerInfo.forEach((row, i) => {
            render.text(row, 12, (i * 16) + 12, .75, "#fff");
        });
    }

    if (onMobile) {
        var ta = input.touchAreas[activeScene];
        for (var i = 0; i < ta.length; i++) {
            render.rectStroke(ta[i].x, ta[i].y, ta[i].width, ta[i].height, "#ffffff80", 2, 0);
            render.text(ta[i].bind, ta[i].x, ta[i].y, 1, "#ffffff80");
        }
    }
    //render.line(player.posX, player.posY, player.posX + (player.velX) + player.hitbox.padding, player.posY + (player.velY) + player.hitbox.padding, "#ff0")
}


