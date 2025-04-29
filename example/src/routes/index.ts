/**
 * Loaders are used for server-side code on GET-requests.
 * A loader can either return:
 * - void: The loader is successfull, the page rendering can continue (View system)
 * - json: The loader is successfull, and data has to be returned (API style)
 *
 * Loaders are chained, meaning loaders from previous matching routes are ran first.
 */
export const loader: APIHandler = async (ctx) => {
  ctx.data.user = { username: "johndoe" };
}

export const view: ViewHandler = ({ data, Components }, next) => `
<div class="page">
  <div>
     <span class="offset offseta">${ Components("/logo", false) }</span>
     <span class="offset offsetb">${ Components("/logo", false) }</span>
     <span>${ Components("/logo", false) }</span>
  </div>
  <div> Hello <span class="username">${data.user.username}</span></div>
</div>
`;

export const style: StyleHandler = (ctx) => `

$ .offset {
  position: absolute;
}

$ .offseta {
  margin: 0 0 1px 0;
  color: #0000ff;
}

$ .offsetb {
  margin: 0 0 -1px 0;
  color: #ff0000;
}

$.page {
  display: flex;
  flex-direction: column;
  align-items: center;
}

$.page>* {
  width: fit-content;
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