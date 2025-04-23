export const view: ViewHandler = ({}, next) => `
<div>
  <div class="name">
    <span>__  __  _____   __    _   _     __   _   ___   __  __ </span>
    <span>\\ \\ \\ \\  | |   / /\\  | | | |   ( (\` | | | |_) / / / / </span>
    <span>/_/ /_/  |_|  /_/--\\ |_| |_|__ _)_) |_| |_|   \\_\\ \\_\\ </span>
    <span></span>
  </div>
</div>
`;

export const style: StyleHandler = (ctx) => `



$>.name {
  margin: 0 auto;
}

$>.name>span {
  display: block;
  font-family: "Roboto Mono", mono, monospace;
}

`


export const client: ClientHandler = (ctx) => ({
  "page:load": () => {
    console.log("Page loaded");

    ctx.emit("test");
  },
  "on:test": (data) => {
    
  }
});

export const socket: SocketHandler = {
  "test": (ctx) => {
    console.log()
  }
}