declare class SocketRoom {
    sockets: string[];
    emit(from: string, event: string, data?: JsonObject): void;
    join(who: string, emit?: boolean): void;
    leave(who: string, emit?: boolean): void;
}
export declare const rooms: {
    [x: string]: SocketRoom;
};
export declare const Room: (name: string) => SocketRoom;
export {};
