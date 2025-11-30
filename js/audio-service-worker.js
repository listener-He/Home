// audio-service-worker.js
// Service Worker for background audio playback

self.addEventListener('install', event => {
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});

// 监听来自主页面的消息
self.addEventListener('message', async event => {
    const client = event.source;
    const data = event.data;
    
    switch (data.action) {
        case 'play':
            // 这里只是示例，实际上Service Worker无法直接播放音频
            // 我们需要采用另一种方式实现
            break;
            
        case 'pause':
            break;
            
        case 'setTrack':
            break;
    }
});

// 使用 Broadcast Channel API 在页面间通信
const broadcastChannel = new BroadcastChannel('audio-control');

broadcastChannel.addEventListener('message', event => {
    const data = event.data;
    // 将消息转发给所有客户端
    self.clients.matchAll().then(clients => {
        clients.forEach(client => {
            client.postMessage(data);
        });
    });
});