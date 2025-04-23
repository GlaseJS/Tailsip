import type { Duplex } from "node:stream";
import { randomUUID } from "node:crypto";
import { Payload } from "./payload.js";
import { $ } from "../../libs/ansi.js";
import { usesSockets } from "../compiler.js";

let socketCount = 0;
export const sockets: {
  [id: string]: SocketUser
} = {}

const GenerateId = () => {
  const id = randomUUID();
  if (id in sockets) return GenerateId();
  return id;
}

export class SocketUser {
  public id: string;
  public lastPing = new Date().getTime();

  constructor(
    public socket: Duplex
  ) {
    this.id = GenerateId();

    socketCount++;
    sockets[this.id] = this;
  }

  send (data: JsonObject)
  {
    if (!this.socket.writable) return this.close();

    const response = Buffer.from(JSON.stringify(data));
    const reply = Buffer.concat([ Buffer.from([0x81, response.length]), response ]);

    this.socket.write(reply);
  }

  Ping()
  {
    this.send(Payload("socket:ping", "host", {}))
  }

  onPing ()
  {
    this.lastPing = new Date().getTime();
  }

  active () 
  {
    return (new Date().getTime() - this.lastPing) < Config.socket.socketTimeoutMS;
  }

  close (reason?: string)
  {
    socketCount--;
    delete sockets[this.id];

    if (this.socket.writable)
    {
      this.send(Payload("socket:close", "host", reason ? { reason } : {}));
      this.socket.end();
    }

    this.socket.destroy();
  }
}

if (usesSockets) setInterval(() => {
  // skip pings when no sockets are connected.
  if (socketCount == 0) return;

  let active = 0;
  let timeout = 0;

  for (const id in sockets)
  {
    if (!sockets[id].active())
    {
      timeout++;
      sockets[id].close("timeout");
      continue;
    }

    active++;
    sockets[id].Ping();
  }

  App.logger!("socket").log(`${$.blue}PING${$.reset}  ::  ${active} open sockets  ::  ${timeout} timed out`);
}, Config.socket.socketPingMS);