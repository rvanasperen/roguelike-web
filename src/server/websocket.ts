import type { ServerMessage } from '@/shared/protocol';
import type { ServerWebSocket } from 'bun';

const clients = new Set<ServerWebSocket>();

export function createWebSocketHandlers() {
    return {
        open(ws: ServerWebSocket) {
            clients.add(ws);
            console.log('[WS] Client connected');
        },

        close(ws: ServerWebSocket) {
            clients.delete(ws);
            console.log('[WS] Client disconnected');
        },

        message(ws: ServerWebSocket, message: string | Buffer) {
            console.log('[WS] Client message', message.toString());
            // todo: parse & route message using protocol types
        },
    };
}

export function broadcast(message: ServerMessage) {
    const payload = JSON.stringify(message);

    for (const client of clients) {
        client.send(payload);
    }
}
