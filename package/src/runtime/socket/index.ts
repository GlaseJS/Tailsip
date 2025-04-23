
import crypto from "node:crypto";

import { Socket as _ } from "../../options/index.js";
import { sockets as handlers } from "../compiler.js";
import { client } from "./client.js";
import { sockets, SocketUser } from "./user.js";
import { Room } from "./room.js";
import { integrityShard, Payload } from "./payload.js";

// Component
export const Socket: _.Component = (opts) => {
  const logger = App.logger!("socket");

  return ({
    client: () => client(opts.address.length > 0 ? opts.address : `${App.address.hostname}:${App.address.port}`),
    host: (server, serverOpts) => {
      server.on("upgrade", (req, socket, head) => {
        logger.log("socket upgrade request");

        if (!req.headers.origin || (serverOpts.allowedOrigins && !serverOpts.allowedOrigins.includes(new URL(req.headers.origin || "").hostname)))
          return socket.destroy();

        const key = req.headers['sec-websocket-key'];
        if (!key)
        {
          socket.write("HTTP/1.1 400 Bad Request\r\n\r\n");
          return socket.destroy();
        }

        const acceptKey = crypto
          .createHash("sha1")
          .update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')
          .digest("base64");
        
        const headers = [
        'HTTP/1.1 101 Switching Protocols',
        'Upgrade: websocket',
        'Connection: Upgrade',
        `Sec-WebSocket-Accept: ${acceptKey}`,
        '\r\n'
        ];

        socket.write(headers.join("\r\n"));

        const user = new SocketUser(socket);
        Room("/").join(user.id);

        socket.on("data", buffer => {
          const op = buffer[0] & 0b00001111;
          const lenByte = buffer[1] & 0b01111111;

          if (buffer.length > opts.maxSize)
            return socket.destroy();
          if (op === 0x8 || (buffer[0] & 0b10000000) === 0 || (buffer[1] & 0b10000000) === 0)
            return user.close("exit");
          if (op === 0x9)
            return socket.write(Buffer.from([0b10001010, 0]));

          let payloadLength = lenByte;
          let offset = 2

          if (payloadLength === 126)
          {
            payloadLength = buffer.readUInt16BE(offset);
            offset += 2;
          }
          else if (payloadLength === 127)
          {
            const high = buffer.readUInt32BE(offset);
            const low = buffer.readUInt32BE(offset+4);

            payloadLength = high * 2 ** 32 + low;
            offset += 8;
          }

          let mask;
          if (buffer[1] & 0b10000000)
          {
            mask = buffer.slice(offset, offset + 4);
            offset += 4;
          }

          const data = buffer.slice(offset, offset+payloadLength);

          if (mask)
            for (let i = 0; i < data.length; i++)
              data[i] ^= mask[i%4];

          const msg = JSON.parse(data.toString("utf8"));
          // Malformed message. This can happen on network errors.
          if (msg.integrityShard != integrityShard || !msg.event || !msg.data)
            return;
          
          if (msg.event == "socket:ping")
            return user.onPing();

          // No handlers for queried event
          if (!(msg.event in handlers))
            return;
          
          for (const handler of handlers[msg.event])
          {
            handler({
              from: user.id, data: msg.data,

              room: (name: string) => ({
                join: () => Room(name).join(user.id),
                emit: (event: string, data?: JsonObject) => Room(name).emit(user.id, event, data),
                leave: () => Room(name).leave(user.id)
              }),

              to: (id: string) => ({
                emit: (event: string, data: JsonObject = {}) => {
                  if (!(id in sockets)) return;
                  sockets[id].send(Payload(event, user.id, data));
                }
              }),

              emit: (event: string, data?: JsonObject) => Room("/").emit(user.id, event, data)
            });
          }
        });

        socket.on("end", () => {
          logger.log("Socket connection closed");
        });
      })
    }
  });
}