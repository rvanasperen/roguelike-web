export type HmrMessage = {
    type: 'hmr';
};

export type ServerMessage = HmrMessage;

type Listener = (msg: ServerMessage) => void;

export class WsClient {
    private socket?: WebSocket;
    private retryDelay = 1000;
    private readonly maxDelay = 30000;
    private readonly url: string;
    private readonly listeners = new Set<Listener>();

    constructor(url: string) {
        this.url = url;
    }

    start() {
        this.connect();
    }

    subscribe(listener: Listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    private connect() {
        const socket = new WebSocket(this.url);
        this.socket = socket;

        socket.addEventListener('open', () => {
            console.log('WebSocket connected');
            this.retryDelay = 1000;
        });

        socket.addEventListener('close', () => {
            console.log(`WebSocket closed, retrying in ${this.retryDelay}ms`);
            setTimeout(() => this.connect(), this.retryDelay);
            this.retryDelay = Math.min(this.retryDelay * 2, this.maxDelay);
        });

        socket.addEventListener('error', (err) => {
            console.error('WebSocket error', err);
            socket.close();
        });

        socket.addEventListener('message', (event) => {
            try {
                const data: ServerMessage = JSON.parse(event.data);

                console.log('WebSocket message', data);

                for (const listener of this.listeners) {
                    listener(data);
                }
            } catch (err) {
                console.error('Failed to parse WS message', err);
            }
        });
    }

    send(data: unknown) {
        if (this.socket?.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(data));
        }
    }
}
