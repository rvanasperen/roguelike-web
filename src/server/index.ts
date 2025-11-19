import type { ServerWebSocket } from 'bun';
import { file, serve } from 'bun';
import { watch } from 'fs';

const clients = new Set<ServerWebSocket>();

const server = serve({
    port: 8000,

    routes: {
        '/api': () => new Response('Api'),

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

    websocket: {
        open(ws) {
            clients.add(ws);
            console.log('Client connected');
        },

        close(ws) {
            clients.delete(ws);
            console.log('Client disconnected');
        },

        message(ws, message) {
            console.log(`Received message: ${message}`);
        },
    },
});

console.log(`Server running on ${server.url}`);

['public/index.js', 'public/style.css'].forEach((path) => {
    try {
        watch(path, () => {
            console.log('[HMR] Change detected', path);

            for (const ws of clients) {
                ws.send(
                    JSON.stringify({
                        type: 'hmr',
                    }),
                );
            }
        });
    } catch (err) {
        console.error(`Failed to watch ${path}`, err);
    }
});
