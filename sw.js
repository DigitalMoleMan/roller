var toCache = [
    './img/ui/hp/label.png',

    './img/ui/hp/statbar_left.png',
    './img/ui/hp/statbar_right.png',
    './img/ui/hp/statbar_mid.png',
    './img/ui/hp/point.png',


    './img/ui/activeItem/label.png',
    './img/ui/activeItem/border.png',
    './img/ui/activeItem/bar.png',
    //items
    './img/ui/activeItem/hookshot.png',
    './img/ui/activeItem/booster.png',
    './img/player/body_0.png',
    './img/player/bands_0.png',
    './img/player/bands_jump_0.png',
    './img/player/cannon_0.png',
    './img/player/hookshot_0.png',
    './img/player/equipment/booster/inactive.png',
    './img/player/equipment/booster/active_0.png',
    './img/player/equipment/booster/cooldown.png',

    './img/tiles/break_block_0.png',
    './img/tiles/block/block_0.png',
    './img/tiles/platform.png',
    './img/tiles/elevator_0.png',
    './img/tiles/spikes_floor.png',
    './img/tiles/spikes_roof.png',
    './img/tiles/hookpoint.png',
    './img/tiles/lamp.png',
    './img/tiles/cog_0.png',
    './img/npcs/enemies/roamer/roamer_0.png',
    './img/npcs/enemies/spike_guard/body_idle_0.png',
    './img/npcs/enemies/laser_turret/base.png',
    './img/npcs/enemies/laser_turret/arm.png',
    './img/npcs/enemies/laser_turret/laser.png',
    './img/npcs/bogus/idle_0.png',


    './img/backgrounds/main.png',
    './img/backgrounds/main2.png',
    './img/backgrounds/metal_bg.png',
    './img/backgrounds/metal.png',


    //Loading /Audio
    //music
    './audio/music/Ready_to_Roll.wav',
    './audio/music/Among disks and drives.wav',
    './audio/music/A mile too deep.wav',
    './audio/music/Cryogenic Malfunction.wav',
    './audio/music/Forgotten Sins.wav',
    './audio/music/Gearing Up.wav',
    './audio/music/Persistent Foe.wav',
    './audio/music/Rambling Machine.wav',
    './audio/music/The Tribute.wav',
    './audio/music/Chain Reactor.wav',
    './audio/music/Hollow.wav',
    './audio/music/Spaced Sax.wav',

    //sfx
    './audio/sfx/player/hurt_0.wav',
    './audio/sfx/player/hurt_1.wav',
    './audio/sfx/player/hurt_2.wav',
    './audio/sfx/hookshot_hook.wav',
    './audio/sfx/hookshot_shoot.wav',
    './audio/sfx/hookshot_wall.wav',
]

self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open('roller').then(function (cache) {
            return cache.addAll([
                './',
                './js/menu.js',
                './js/render.js',
                './js/input.js',
                './js/player.js',
                './js/world.js',
                './js/main.js',
                './style.css',
            ].concat(toCache));
        })
    );
});
self.addEventListener('fetch', function (event) {

    event.respondWith(

        caches.match(event.request).then(function (response) {

            return response || fetch(event.request);

        })

    );


});



//Loading sprites
