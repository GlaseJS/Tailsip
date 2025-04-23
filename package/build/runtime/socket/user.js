import { randomUUID } from "node:crypto";
import { Payload } from "./payload.js";
import { $ } from "../../libs/ansi.js";
import { usesSockets } from "../compiler.js";
let socketCount = 0;
export const sockets = {};
const GenerateId = () => {
    const id = randomUUID();
    if (id in sockets)
        return GenerateId();
    return id;
};
export class SocketUser {
    socket;
    id;
    lastPing = new Date().getTime();
    constructor(socket) {
        this.socket = socket;
        this.id = GenerateId();
        socketCount++;
        sockets[this.id] = this;
    }
    send(data) {
        if (!this.socket.writable)
            return this.close();
        const response = Buffer.from(JSON.stringify(data));
        const reply = Buffer.concat([Buffer.from([0x81, response.length]), response]);
        this.socket.write(reply);
    }
    Ping() {
        this.send(Payload("socket:ping", "host", {}));
    }
    onPing() {
        this.lastPing = new Date().getTime();
    }
    active() {
        return (new Date().getTime() - this.lastPing) < Config.socket.socketTimeoutMS;
    }
    close(reason) {
        socketCount--;
        delete sockets[this.id];
        if (this.socket.writable) {
            this.send(Payload("socket:close", "host", reason ? { reason } : {}));
            this.socket.end();
        }
        this.socket.destroy();
    }
}
let pingCounts = 0;
let active = 0;
let timeout = 0;
if (usesSockets)
    setInterval(() => {
        // skip pings when no sockets are connected.
        if (socketCount == 0)
            return;
        pingCounts++;
        for (const id in sockets) {
            if (!sockets[id].active()) {
                timeout++;
                sockets[id].close("timeout");
                continue;
            }
            active++;
            sockets[id].Ping();
        }
        if (pingCounts > Config.socket.socketLogFrequency) {
            App.logger("socket").log(`${$.blue}PING${$.reset}  ::  ${active} open sockets  ::  ${timeout} timed out`);
            pingCounts = 0;
            active = 0;
            timeout = 0;
        }
    }, Config.socket.socketPingMS);
