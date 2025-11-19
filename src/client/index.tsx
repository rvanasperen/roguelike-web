import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import { setupHmr } from './hmr';
import { WsClient } from './ws-client';

const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const host = window.location.hostname;
const port = 8000;
const wsUrl = `${protocol}//${host}:${port}/ws`;

const wsClient = new WsClient(wsUrl);
wsClient.start();

setupHmr(wsClient);

const rootElement = document.getElementById('app')!;
const root = createRoot(rootElement);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
