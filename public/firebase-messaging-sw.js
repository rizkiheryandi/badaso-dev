let cacheName = "app-badaso-cache";
let broadcastChannelName = "sw-badaso-messages";
const BROADCAST_TYPE_ONLINE_STATUS = "BROADCAST_TYPE_ONLINE_STATUS";
const BROADCAST_TYPE_FIREBASE_MESSAGE = "BROADCAST_TYPE_FIREBASE_MESSAGE";
let broadcastChannel = null;
let broadcastMessageFormat = (type, data, message, errors) => {};

try {
    let broadcastChannel = new BroadcastChannel(broadcastChannelName);
    let broadcastMessageFormat = (type, data, message, errors) => {
    broadcastChannel.postMessage({ type, data, message, errors });
    };
} catch (error) {
    console.log('Error broadcast channel ', error)
}

try {
self.addEventListener("install", (e) => {
    console.log("Worker Installed");
});
self.addEventListener("active", (e) => {
    e.waitUntil(self.clients.claim());
    e.waitUntil(
    caches.keys().then((cacheNames) =>
        Promise.all(
        cacheNames.map((cache, index) => {
            if (cache !== cacheName) {
            caches.delete(cache);
            }
        })
        )
    )
    );
});
self.addEventListener("fetch", function (event) {
    event.respondWith(
    caches.open(cacheName).then(function (cache) {
        return fetch(event.request)
        .then((networkResponse) => {
            if (event.request.method == "GET") {
            cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
        })
        .catch((error) => {
            return caches.match(event.request).then((response) => {
            return response;
            });
        });
    })
    );
});
} catch (error) {}
try {
    importScripts("https://www.gstatic.com/firebasejs/8.2.7/firebase-app.js");
    importScripts(
        "https://www.gstatic.com/firebasejs/8.2.7/firebase-messaging.js"
    );
    var firebaseConfig = {
        apiKey: "AIzaSyBPyvv_E1Tg4lcoXbbv-8dKTEQu6W7T4K0",
        authDomain: "gurusaham---sinyal-saham.firebaseapp.com",
        projectId: "gurusaham---sinyal-saham",
        storageBucket: "gurusaham---sinyal-saham.appspot.com",
        messagingSenderId: "1039577391903",
        appId: "1:1039577391903:web:55046998649164ab80462a",
        measurementId: "G-3W195VP0J0",
    };
    const app = firebase.initializeApp(firebaseConfig);
    const messaging = firebase.messaging();
    messaging.onBackgroundMessage((payload) => {
        try {
            broadcastMessageFormat(
                BROADCAST_TYPE_FIREBASE_MESSAGE,
                payload,
                null,
                null
            );
        } catch (error) {
            console.log('Error broadcast channel', error)
        }
    });
} catch (error) {}