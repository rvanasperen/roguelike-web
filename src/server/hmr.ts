import { watch } from 'fs';
import { broadcast } from './websocket';

const watchedFiles = ['public/index.js', 'public/style.css'];

export function setupHmr() {
    for (const path of watchedFiles) {
        try {
            watch(path, () => {
                console.log('[HMR] Change detected', path);
                broadcast({ type: 'reload' });
            });
        } catch (err) {
            console.error(`[HMR] Failed to watch ${path}`, err);
        }
    }
}
