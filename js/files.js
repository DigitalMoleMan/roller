/**
     * imports an image.
     * @param {String} path directory of the image.
     */
importImage = (path) => {
    let img = new Image;
    img.src = path;
    return (img);
}

/**
 * imports a series of images as a sprite
 * @param {String} path directory of the sprite.
 * @param {Number} length The number of frames the sprite has.
 * @returns {Array} returns an array where each index represents a frame.
 */
importSprite = (path, length) => {

    let sprite = new Array;

    for (let i = 0; i < length; i++) {
        let img = importImage(path + '_' + i + '.png');
        sprite.push(img);
    }

    return sprite
}


class SpriteSheet {
    constructor(source, sourceWidth, sourceHeight) {
        this.source = importImage(source);
        this.sourceWidth = sourceWidth;
        this.sourceHeight = sourceHeight;
    }
}

let sprites = {
    ui: {
        hp: {
            label: importImage('img/ui/hp/label.png'),
            left: importImage('img/ui/hp/statbar_left.png'),
            right: importImage('img/ui/hp/statbar_right.png'),
            mid: importImage('img/ui/hp/statbar_mid.png'),
            point: importImage('img/ui/hp/point.png'),
        },
        activeItem: {
            label: importImage('img/ui/activeItem/label.png'),
            border: importImage('img/ui/activeItem/border.png'),
            bar: importImage('img/ui/activeItem/bar.png'),
            //items
            hookshot: importImage('img/ui/activeItem/hookshot.png'),
            booster: importImage('img/ui/activeItem/booster.png'),
        },
        dialogueBox: {
            left: importImage('img/ui/dialogue_box/border_left.png'),
            right: importImage('img/ui/dialogue_box/border_right.png'),
            middle: importImage('img/ui/dialogue_box/border_middle.png')
        }
    },
    player: {
        body: new SpriteSheet('img/player/body_sheet.png', 32, 32),
        bands: new SpriteSheet('img/player/bands_sheet.png', 32, 32),
        bandsJump: new SpriteSheet('img/player/bands_jump_sheet.png', 32, 32),
        bandsFall: new SpriteSheet('img/player/bands_fall_sheet.png', 32, 32),
        bandsMeteor: new SpriteSheet('img/player/bands_meteor_sheet.png', 32, 32),
        cannon: importSprite('img/player/cannon', 13),
    },
    items: {
        hookshot: {
            hook: importSprite('img/player/hookshot', 8),
            recticle: importImage('img/ui/hookshot_recticle.png')
        },
        booster: {
            inactive: importImage('img/player/equipment/booster/inactive.png'),
            active: importSprite('img/player/equipment/booster/active', 3),
            cooldown: importImage('img/player/equipment/booster/cooldown.png'),
        }
    },
    tiles: {
        block: {
            metal: new SpriteSheet('img/tiles/block/block_metal_sheet.png', 16, 16),
            dirt: importSprite('img/tiles/block/dirt', 16),
            alt_metal: importSprite('img/tiles/block/alt_metal', 16),
            alt_dirt: importSprite('img/tiles/block/alt_dirt', 0),
        },
        platform: importImage('img/tiles/platform.png'),
        elevator: importSprite('img/tiles/elevator', 8),
        spikes: {
            metal_up: importImage('img/tiles/spikes_floor.png'),
            metal_down: importImage('img/tiles/spikes_roof.png'),
        },
        hookpoint: importImage('img/tiles/hookpoint.png'),
        "L": importImage('img/tiles/lamp.png'),
        pumpkin: importImage('img/tiles/pumpkin.png'),
        candy: importImage('img/tiles/candy.png')
    },
    npcs: {
        enemies: {
            roamer: importSprite('img/npcs/enemies/roamer/roamer', 6),
            spikeGuard: {
                idle: importSprite('img/npcs/enemies/spike_guard/body_idle', 6),
                hw: importImage('img/npcs/enemies/spike_guard/hw.png')
            },
            laserTurret: {
                base: importImage('img/npcs/enemies/laser_turret/base.png'),
                arm: importImage('img/npcs/enemies/laser_turret/arm.png'),
                laser: importImage('img/npcs/enemies/laser_turret/laser.png'),
            }
        },
        bogus: {
            idle: importSprite('img/npcs/bogus/idle', 10),
            hw_anim: importImage('img/npcs/bogus/hw_anim.png')
        },
        hwSign: importImage('img/npcs/hw_sign.png')

    },
    backgrounds: [
        importImage('img/backgrounds/main.png'),
        importImage('img/backgrounds/main2.png'),
        importImage('img/backgrounds/metal_bg.png'),
        importImage('img/backgrounds/metal.png'),
        importImage('img/backgrounds/halloween.png'),
        importImage('img/backgrounds/halloween_sky.png')
    ],
}

let music = [
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

let sfx = {
    player: {
        movement: {
            jump: 'audio/sfx/player/jump.wav',
            landing: 'audio/sfx/player/landing.wav',
            rolling: 'audio/sfx/player/rolling.wav',
        },

        feedback: {
            hurt: 'audio/sfx/player/hurt_0.wav'
        }
    },
    items: {
        hookshot: {
            hook: 'audio/sfx/hookshot_hook.wav',
            shoot: 'audio/sfx/hookshot_shoot.wav',
            wall: 'audio/sfx/hookshot_wall.wav',
        }
    },
    tiles: {
        candy: {
            collect: 'audio/sfx/hw_candy.wav'
        }
    },
    ui: {
        dialogue: {
            next: 'audio/sfx/tick.wav',
            text: 'audio/sfx/text.wav'
        }
    },
    npcs: {
        bogus: {
            lightning: 'audio/sfx/lightning.wav',
            startup: 'audio/sfx/hw_startup.wav',
        }
    }
}