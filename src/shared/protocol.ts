interface Message<Type extends string> {
    type: Type;
}

export type ServerPingMessage = Message<'ping'>;
export type ServerReloadMessage = Message<'reload'>;
export type ServerMessage = ServerPingMessage | ServerReloadMessage;

export type ClientPongMessage = Message<'pong'>;
export type ClientMessage = ClientPongMessage;
