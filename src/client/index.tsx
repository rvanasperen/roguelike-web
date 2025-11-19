import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';

const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const host = window.location.hostname;
const port = 8000;
const wsUrl = `${protocol}//${host}:${port}/ws`;

let retryDelay = 1000;
const maxDelay = 30000;

const connect = () => {
    const socket = new WebSocket(wsUrl);

    socket.addEventListener('open', () => {
        console.log('WebSocket connected');
        retryDelay = 1000;
    });

    socket.addEventListener('close', () => {
        console.log(`WebSocket closed, retrying in ${retryDelay}ms`);
        setTimeout(connect, retryDelay);
        retryDelay = Math.min(retryDelay * 2, maxDelay);
    });

    socket.addEventListener('error', (err) => {
        console.error('WebSocket error', err);
        socket.close();
    });

    type HmrMessage = {
        type: 'hmr';
    };

    type ServerMessage = HmrMessage;

    socket.addEventListener('message', (event) => {
        try {
            const data: ServerMessage = JSON.parse(event.data);

            if (data.type === 'hmr') {
                window.location.reload();
            }
        } catch (err) {
            console.error('Failed to parse WS message', err);
        }
    });
};

connect();

const rootElement = document.getElementById('app')!;
const root = createRoot(rootElement);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
