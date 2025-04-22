// @ts-nocheck
// Comment only between /* */ in this method to ease cleanup.
export const client = (address: string) => `
  const socket = new WebSocket("ws://${address}");

  socket.onopen = () => {
    console.log("Websockets connected");
  };

  socket.onmessage = (event) => {
    console.log('Received:', event.data);
  };

  socket.onclose = () => {
    console.log('Connection closed');
  };

  socket.onerror = (err) => {
    console.error('Socket error', err);
  };
`.replace(/\/\*[\s\S]*?\*\//g, '');