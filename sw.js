// sw.js

const CACHE_NAME = 'sitio-cache-v2'; // Mude a versão se atualizar os arquivos
const urlsToCache = [
    '/',
    '/index.html',
    '/login.html',
    '/style.css',
    '/admin-style.css',
    '/app.js',
    '/auth.js',
    '/firebase-config.js',
    '/manifest.json',
    'https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Roboto:wght@400;500&display=swap',
    'https://fonts.gstatic.com/s/merriweather/v30/u-440qyriQwlOrhSvowK_l5-fCZMdeX3rg.woff2',
    'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.woff2',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
];

// Evento de Instalação: Salva os arquivos essenciais no cache.
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache aberto. Adicionando URLs ao cache.');
                return cache.addAll(urlsToCache);
            })
    );
});

// Evento de Ativação: Limpa caches antigos.
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Limpando cache antigo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Evento de Fetch: Intercepta as requisições.
// Estratégia: Cache First (tenta pegar do cache primeiro, se falhar, vai para a rede).
self.addEventListener('fetch', event => {
    // Não faz cache de requisições para o Firebase Firestore
    if (event.request.url.includes('firestore.googleapis.com')) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Se a resposta estiver no cache, retorna ela.
                if (response) {
                    return response;
                }

                // Se não, busca na rede, retorna e também salva uma cópia no cache.
                return fetch(event.request).then(
                    networkResponse => {
                        // Verifica se a resposta é válida
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                            return networkResponse;
                        }

                        // Clona a resposta para poder ser usada pelo navegador e pelo cache
                        const responseToCache = networkResponse.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return networkResponse;
                    }
                );
            })
    );
});
