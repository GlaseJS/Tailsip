import type { Duplex } from "node:stream";
export declare const sockets: {
    [id: string]: SocketUser;
};
export declare class SocketUser {
    socket: Duplex;
    id: string;
    lastPing: number;
    constructor(socket: Duplex);
    send(data: JsonObject): void;
    Ping(): void;
    onPing(): void;
    active(): boolean;
    close(reason?: string): void;
}
