
import { ClientWrapper } from "../../libs/clientWrapper.js";
import { integrityShard } from "./payload.js";

export const client = (address: string) => ClientWrapper(($tsr) => {
    const integrityShard = "$tsr.integrityShard";
    const socket = new WebSocket("ws://$tsr.address");

    const send = (event: string, data = {}) =>
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
}, { integrityShard, address }).slice(8, -1); // Slice to remove the wrapper method