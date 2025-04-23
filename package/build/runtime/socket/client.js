// @ts-nocheck
import { integrityShard } from "./payload.js";
// Comment only between /* */ in this method to ease cleanup.
export const client = (address) => `
    const integrityShard = "${integrityShard}";
    const socket = new WebSocket("ws://${address}");

    const send = (event, data = {}) =>
      socket.send(JSON.stringify({
        event, integrityShard, data
      }));

    socket.onopen = () => {
      console.log("Websockets connected");
    };

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.integrityShard != integrityShard) return;
      if (msg.event == "socket:ping" && msg.from == "host") return send("socket:ping");
    };

    socket.onclose = () => {
      console.log('Connection closed');
    };

    socket.onerror = (err) => {
      console.error('Socket error', err);
    };
`.replace(/\/\*[\s\S]*?\*\//g, '');
