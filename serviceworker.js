var ORIGIN = location.protocol + '//' + location.hostname + '/self';
var STATIC_CACHE_NAME = 'static_v1';
console.log('ORIGIN : ' + ORIGIN);
var STATIC_FILES = [
    ORIGIN + '/',
    ORIGIN + '/appointment.html',
    ORIGIN + '/checkAppointment.html',
    ORIGIN + '/checkResult.html',
    ORIGIN + '/clinicalData.html',
    ORIGIN + '/editMyData.html',
    ORIGIN + '/menu.html',
    ORIGIN + '/myData.html',
    ORIGIN + '/newlogin.html',
    ORIGIN + '/result.html',
    ORIGIN + '/ratchet.min.css',
    ORIGIN + '/main.css',
    ORIGIN + '/Image/shikkan1.png',
    ORIGIN + '/Image/sikkan2.png',
    ORIGIN + '/Image/shikkan3.png',
    ORIGIN + '/javaScript/appointment.js',
    ORIGIN + '/javaScript/checkAppointment.js',
    ORIGIN + '/javaScript/checkResult.js',
    ORIGIN + '/javaScript/editmydata.js',
    ORIGIN + '/javaScript/login.js',
    ORIGIN + '/javaScript/myData.js',
    ORIGIN + '/javaScript/newlogin.js',
    ORIGIN + '/javaScript/result.js',
    ORIGIN + '/jquery-2.2.4.min.js',
];

var STATIC_FILE_URL_HASH = {};
STATIC_FILES.forEach(function(x) {STATIC_FILE_URL_HASH[x] = true});

/*
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(STATIC_CACHE_NAME)
        .then(function(cache) {
            return Promise.all(STATIC_FILES.map(function(url) {
                return fetch(new Request(url))
                .then(function(response) {
                    console.log('requesting : ' + response.url + ', response : ' + response);
                    if(!response.ok) {
                        return Promise.reject('Invalid response. URL: ' + response.url + 
                        'Status: ' + response.status);
                    }
                    return cache.put(response.url, response);
                });
            }));
        })
    )
})
*/

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(STATIC_CACHE_NAME)
            .then(function(cache) {
                return Promise.all(
                    STATIC_FILES.map(function(url) {
                        return fetch(new Request(url, { cache: 'no-cache', mode: 'no-cors'}))
                        .then(function(response) {
                            console.log('saving cache : ' + url);
                            return cache.put(url, response);
                        });

                    })
                );
            })
    );
});

/*
self.addEventListener('fetch', function(event) {
    if(!STATIC_FILE_URL_HASH[event.request.url]) return;
    //let cache = caches.match(event.request, {cacheName: STATIC_CACHE_NAME});
    //if(!cache) return;
    //event.respondWith(cache);
    event.respondWith(caches.match(event.request, { cacheName: STATIC_CACHE_NAME}));
});

*/
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
                return response || fetch(event.request)
        })
    );
});

const STATIC_CACHE_NAMES = [
    STATIC_CACHE_NAME
];

/*

self.addEventListener('activate', function(event) {
    var cacheDeleting = function(keys) {
        var promises = [];
        keys.forEach(function(cacheName) 
            if(cacheName != STATIC_CACHE_NAME) {
                promises.push(caches.delete(cacheName));
            }
        });
        return Promise.all(promises);
    }
    event.waitUntil(caches.keys().then(cacheDeleting));
});
*/

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys()
            .then(function(keys) {
                return Promise.all(
                    keys.filter(function(key) {
                        return !STATIC_CACHE_NAMES.includes(key);
                    }).map(function(key) {
                        return caches.delete(key);
                    })
                );
            })

    );
});
