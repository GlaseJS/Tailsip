import * as http from "node:http";

const defaultOptions = {
  isSSL: false as boolean
};

class _Context
{
  url: URL;
  code = 200;
  headers: Headers = new Headers();

  constructor(
    public request: http.IncomingMessage,
    public response: http.ServerResponse,
    public options?: Partial<typeof defaultOptions>
  ) {
    const opts = { ...defaultOptions, ...options };

    this.url = new URL(`http${opts.isSSL ? "s" : ""}://${process.env.HOST ?? 'localhost'}${request.url}`);
  }

  end()
  {
    const SetCookies: string[] = [];
    this.headers.forEach((v, k) => {
      if (k === "Set-Cookie")
        SetCookies.push(v);
      else
        this.response.setHeader(k, v);
    });

    if (SetCookies.length != 0) this.response.setHeader("Set-Cookie", SetCookies);

    this.response.writeHead(this.code);
    this.response.end();
  }
}

const contextFactory = (
  request: http.IncomingMessage,
  response: http.ServerResponse,
  options?: Partial<typeof defaultOptions>
) => new _Context(request, response, options) as Context;

declare global {
  var $context: typeof contextFactory;
  interface Context extends _Context {}
}
$globalize("$context", contextFactory);