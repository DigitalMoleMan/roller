/**
 * Roller - main.js
*/

let settings = {
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
let hwQuest = {
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

let browser = getBrowserName();

let onMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

lastIndex = (array) => array.length - 1;

randomIndex = (array) => array[Math.round(Math.random() * lastIndex(array))];
let canvasWidth = 1024;
let canvasHeight = 576;
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

let gameClock = 0;
let activeScene
let nearPlayer = [];
let onScreen = [];
let onScreenSegs = [];
let onScreenLights = [];

const fontFile = new SpriteSheet('fonts/roller_font.png', 8, 8);

if (settings.misc.halloweenMode) {
    sprites.player.body = render.importSprite('img/player/hw_body', 13)
    sprites.npcs.bogus.boogus = render.importSprite('img/npcs/bogus/hw_idle', 10)
}

document.addEventListener(input.binds["global"].toggleDebug, () => settings.misc.debugMode = !settings.misc.debugMode);

/**
 * @param {Scene} scene
 */
setScene = (scene) => {
    activeScene = scene;
}

initServiceWorker = () => {
    if ('serviceWorker' in navigator) {
        let swURL = './sw.js';
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

    first = Date.now()
    switch (settings.misc.gameLoopMethod) {
        case 'interval': setInterval(() => loop(Date.now()), 1000 / 60); break;
        case 'raf': loop(0); break;
        default: setInterval(() => loop(), 1000 / 60);
    }
    //render.update();
}


let deltaTime = 0;
let previous = 0;



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
    if (onMobile) {
        canvasWidth = window.innerWidth;
        canvasHeight = window.innerHeight;
        render.renewCanvas();
    }
}

class Background {
    constructor(parts, drawFunction) {
        this.parts = parts;
        this.draw = () => drawFunction(parts);
    }
}

let backgrounds = {
    metal: new Background([sprites.backgrounds[3]], (parts) => {
        let bg = parts[0];

        for (let y = 0; y < (canvasHeight * 4); y += (bg.height * 2)) {
            for (let x = 0; x < (canvasWidth * 4); x += (bg.width * 2)) {
                render.img(bg, x, y, .75, 2);
            }
        }
    }),

    hw: new Background([sprites.backgrounds[4], sprites.backgrounds[5]], (parts) => {
        let bg = parts[0];
        let bg2 = parts[1];
        for (let x = 0; x < (canvasWidth); x += bg.width) {
            for (let y = 0; y < (canvasHeight * 2); y += bg.height * 2) {
                render.img(bg2, x + camera.x, y + camera.y, 1.1);
            }
            render.img(bg, (x - ((camera.x / 5) % (bg.width))), (canvasHeight - (bg.height)) + (((world.height - canvasHeight) - camera.y) / 10), 0);
        }
    })
}

class Scene {
    constructor(update, draw) {
        this.update = () => update();
        this.draw = () => draw();
    }
}

let scenes = {
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

        render.rect(0, 0, canvasWidth, canvasHeight, '#181425', 0);

        backgrounds.metal.draw();

        world.npcs.forEach(npc => npc.draw());


        player.draw();

        // world
        for (let tile of onScreen) tile.draw()

        for (let tile of onScreenSegs.filter((seg) => seg.type == "block")) tile.draw();

        render.particleEngine.update()
        lighting.update();
        lighting.draw();




        //ui
        let hpUi = sprites.ui.hp;

        render.img(hpUi.label, 32, 16, 0);

        for (let i = 0; i < player.maxHp; i++) {
            if (i == 0) render.img(hpUi.left, 48, 16, 0);
            else if (i == player.maxHp - 1) render.img(hpUi.right, 48 + (i * 16), 16, 0)
            else render.img(hpUi.mid, 48 + (i * 16), 16, 0);
        }

        for (var i = 0; i < player.hp; i++) render.img(hpUi.point, 52 + (12 * i), 16, 0)

        if (world.inRangeActors.length > 0 && activeScene == 'game') {
            let actor = world.inRangeActors[0];
            render.text('E', actor.posX + (actor.interactionRadius / 2.5), actor.posY - block(), 2, 1);
        }

        var itemUi = sprites.ui.activeItem;

        render.img(itemUi.label, 12, 32, 0);
        render.img(itemUi.border, 48, 32, 0);
        render.img(itemUi[player.activeItem.name], 48, 32, 0);
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


