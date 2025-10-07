import "./index.js";

import "./logo.js";

const server = $server();
const address = server.listen(undefined, false);
$log`$c36    ~ Server open at ${address} ~  $c0\n`

const methodColor: {[x: string]: string} = {
  "GET": "$c32",
  "POST": "$c34"
}
$middleware(async (ctx) => {
  $log`${methodColor[ctx.request.method ?? "GET"]}${ctx.request.method}$c0 ${ctx.url.pathname}`;
  ctx.code = 200;
  ctx.end();
});