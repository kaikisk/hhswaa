var ORIGIN = location.protocol + '//' + location.hostname + '/hhswaa';
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
    ORIGIN + '/index.html',
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
    ORIGIN + '/javaScript/notification.js',
];

var STATIC_FILE_URL_HASH = {};
STATIC_FILES.forEach(function(x) {STATIC_FILE_URL_HASH[x] = true});

self.addEventListener('install', function(event){
    event.waitUntil(
        caches.open(STATIC_CACHE_NAME)
        .then(function(cache){
            console.log('Install cache');
            return cache.addAll(STATIC_FILES);
        })
    )
})
/*
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
                return response || fetch(event.request)
        })
    );
});

self.addEventListener('fetch', function(event){});
*/

self.addEventListener('fetch', function(event) {
  //ブラウザが回線に接続しているかをboolで返してくれる
  var online = navigator.onLine;

  //回線が使えるときの処理
  if(online){
    event.respondWith(
      caches.match(event.request)
        .then(
        function (response) {
          if (response) {
            return response;
          }
          //ローカルにキャッシュがあればすぐ返して終わりですが、
          //無かった場合はここで新しく取得します
          return fetch(event.request)
            .then(function(response){
              // 取得できたリソースは表示にも使うが、キャッシュにも追加しておきます
              // ただし、Responseはストリームなのでキャッシュのために使用してしまうと、ブラウザの表示で不具合が起こる(っぽい)ので、複製しましょう
              cloneResponse = response.clone();
              if(response){
                //ここ&&に修正するかもです
                if(response || response.status == 200){
                  //現行のキャッシュに追加
                  caches.open(STATIC_CACHE_NAME)
                    .then(function(cache)
                    {
                      cache.put(event.request, cloneResponse)
                      .then(function(){
                        //正常にキャッシュ追加できたときの処理(必要であれば)
                      });
                    });
                }else{
                  //正常に取得できなかったときにハンドリングしてもよい
                  return response;
                }
                return response;
              }
            }).catch(function(error) {
              //デバッグ用
              return console.log(error);
            });
        })
    );
  }else{
    //オフラインのときの制御
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          // キャッシュがあったのでそのレスポンスを返す
          if (response) {
            return response;
          }
          //オフラインでキャッシュもなかったパターン
          return caches.match("offline.html")
              .then(function(responseNodata)
              {
                //適当な変数にオフラインのときに渡すリソースを入れて返却
                //今回はoffline.htmlを返しています
                return responseNodata;
              });
        }
      )
    );
  }
});

const STATIC_CACHE_NAMES = [
    STATIC_CACHE_NAME
];

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
