import type { ServerMessage, WsClient } from './ws-client';

export function setupHmr(wsClient: WsClient) {
    wsClient.subscribe((message: ServerMessage) => {
        if (message.type === 'hmr') {
            window.location.reload();
        }
    });
}
