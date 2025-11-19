import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';

const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const host = window.location.hostname;
const port = 8000;
const wsUrl = `${protocol}//${host}:${port}/ws`;

const connect = () => {
    const socket = new WebSocket(wsUrl);

    socket.addEventListener('open', () => {
        console.log('WebSocket connected');
    });

    socket.addEventListener('message', (event) => {
        try {
            const data = JSON.parse(event.data);

            if (data.type === 'hmr' && data.payload === 'reload') {
                window.location.reload();
            }
        } catch (err) {
            console.error('Failed to parse WS message', err);
        }
    });

    socket.addEventListener('close', () => {
        console.log('WebSocket closed, retrying in 1s');
        setTimeout(connect, 1000);
    });

    socket.addEventListener('error', (err) => {
        console.error('WebSocket error', err);
        socket.close();
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
