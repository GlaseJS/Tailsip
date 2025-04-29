
import type { IncomingMessage, ServerResponse } from "node:http";
import { obfuscate } from "../libs/obfuscate.js";

import { components, InternalComponent, InternalRoute, routes, splats } from "./compiler.js";

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
    this.url = new URL(App.address + (request.url?.slice(1) || ""));
    this.pathname = this.url.pathname;
    this.params   = this.url.searchParams;

    const file = this.pathname.match(/(.*)\.([0-9a-z]{1,4})$/i);
    this.id = this.params.get("id") || "";
    if (file)
    {
      this.pathname = file[1];
      this.fileType = file[2];
    }

    const { query, route } = GetRoute(this.pathname);
    this.query = query;
    this.route = route;
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

  public data: {[x: string]: any} = {};

  private componentsCount = 0;
  public GenerateElementId = () => `${obfuscate(this.componentsCount++)}`;

  public getRoute = () => {
    if (this.route in routes) return routes[this.route] as InternalRoute;
    else if (this.route in components) return components[this.route] as InternalComponent;
  }

  public bundled: { css: string[], js: string[] } = { css: [], js: [] };

  /**
   * Fetches a component and instantiate it.
   * A bundled component is automatically attached to the route resolution system, meanining this component
   * likely has only a few instances variations possible.
   * On the opposite, and unbundled component will have its js and css resolved independently.
   */
  public Components = (path: string, bundled: boolean = true) => {
    const route = path;
    if (!(route in components))
    {
      App.logger!("ctx").log(`Attempting to render an inexisting component  ::  ${route}`);
      return "";
    }
    const md = components[route];
    return md.view?.[0](this, () => "", bundled);
  }

  public [Symbol.dispose]()
  {
    // Purge potentially large objects early.
    delete this.body;
    this.data = {};
    this.query = {};
  }
}

declare global {
  type Context = InstanceType<typeof Context>
}