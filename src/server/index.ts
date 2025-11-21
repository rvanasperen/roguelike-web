import { file, serve } from 'bun';
import { setupHmr } from './hmr';
import { createWebSocketHandlers } from './websocket';

const server = serve({
    port: 8000,

    routes: {
        '/api': () => new Response('this is the api'),

        '/ws': (req, serverInstance) => {
            if (serverInstance.upgrade(req)) {
                return;
            }

            return new Response('WebSocket upgrade failed', { status: 400 });
        },

        '/': () => new Response(file('public/index.html')),
    },

    async fetch(req) {
        const url = new URL(req.url);
        const filePath = `public${url.pathname}`;
        const staticFile = file(filePath);

        if (await staticFile.exists()) {
            return new Response(staticFile);
        }

        return new Response('Not found', { status: 404 });
    },

    websocket: createWebSocketHandlers(),
});

setupHmr(); // todo: local dev only

console.log(`Server running on ${server.url}`);
