// Service Worker for PWA
const CACHE_NAME = 'honesty-home-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/about.html',
  '/css/style.css',
  '/css/about.css',
  '/css/artalk.css',
  '/js/config.js',
  '/js/main.js',
  '/js/about.js'
];

// 安装事件 - 缓存资源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 获取事件 - 拦截网络请求
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果在缓存中找到响应，则返回缓存的资源
        if (response) {
          return response;
        }
        
        // 克隆请求，因为请求是一个流，只能被消费一次
        const fetchRequest = event.request.clone();
        
        // 如果没有在缓存中找到，则发起网络请求
        return fetch(fetchRequest).then(response => {
          // 检查响应是否有效
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // 克隆响应，因为响应是一个流，只能被消费一次
          const responseToCache = response.clone();
          
          // 打开缓存并将响应添加到缓存中
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
            
          return response;
        });
      })
    );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});