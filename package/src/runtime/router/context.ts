
import type { IncomingMessage, ServerResponse } from "node:http";
import { obfuscate } from "../../libs/obfuscate.js";

import { InternalRoute, routes, splats } from "./preload.js";

const GetRoute = (path: string) => {
  let route = path;
  const query: {[x: string]: string} = {};

  for (const splat of splats)
  {
    route = route.replace(new RegExp(`\\${splat.pattern}([a-zA-Z0-9\\-]+)`, "g"), (str, value) => {
      query[splat.name] = value;
      return '$';
    });
  }

  return { route, query };
}

export class Context
{
  constructor(
    public request: IncomingMessage,
    public response: ServerResponse,
    public headers: Headers,
    public body?: JsonObject
  ) {
    this.url = new URL(`${App.address}${request.url || ""}`);
    this.pathname = this.url.pathname;
    this.params   = this.url.searchParams;

    const file = this.pathname.match(/(.*)(\#?[0-9a-zA-Z]*)\.([0-9a-z]{1,4})$/i);
    this.id = "";
    if (file)
    {
      this.pathname = file[1];
      this.id = file[2];
      this.fileType = file[3];
    }

    const { query, route } = GetRoute(this.pathname);
    this.query = query;
    this.route = route;
    if (route in routes) this.routeModule = routes[route];
  }

  public url: URL;

  public title: string = "";
  public meta: MetaHandler = [];
  public lang: string = "en-US";

  public fileType?: string;
  public id: string;

  public pathname: string
  public params: URLSearchParams;

  public route: string;
  public query: { [x: string]: string };
  public routeModule?: InternalRoute;

  public data = {};

  private componentsCount = 0;
  public GenerateElementId = () => `$${obfuscate(this.componentsCount++)}`;

  public getRoute = () => routes[this.route];
}

declare global {
  type Context = InstanceType<typeof Context>
}