self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open('roller').then(function (cache) {
            return cache.addAll([
                './',
               './audio/',
               './fonts/',
               './img/',
                './js/',
                './js/menu.js',
                './js/render.js',
                './js/input.js',
                './js/player.js',
                './js/world.js',
                './js/main.js',
                './style.css',
            ]);
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

