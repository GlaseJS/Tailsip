
import type { IncomingMessage, ServerResponse } from "node:http";

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

    const file = this.pathname.match(/(.*)\.([0-9a-z]{1,4})$/i);
    if (file)
    {
      this.pathname = file[1];
      this.fileType = file[2];
    }
    
    // We preprend an empty route so that the root of the folder always gets processed first.
    const [routes, query] = this.MatchRoute(this.pathname.split("/").filter(Boolean));
    this.routes = routes;
    this.query = query;
  }

  public url: URL;

  public title?: TitleHandler;
  public meta: MetaHandler = [];
  public lang?: string;

  public fileType?: string;

  public pathname: string
  public params: URLSearchParams;

  public routes : RouteModule[];
  public query: { [x: string]: string };

  public data = {};

  

  MatchRoute(path: string[]): [RouteModule[], {[x: string]: string}]
  {
    let current: RoutePart = App.routes;
    const solved: RouteModule[] = [];
    const params: {[x: string]: string} = {};

    for (const route of path)
    {
      if (!current) return [solved, params];

      // Match layout
      if ("_layout" in current && current["_layout"].type == "Route")
        solved.push(current["_layout"] as RouteModule);

      // Match named route
      if (route in current)
      {
        // Match named route file, end of rendering
        if (current[route].type == "Route")
        {
          solved.push(current[route] as RouteModule);
          return [solved, params];
        }
        // Match named route folder, change context
        current = current[route] as RoutePart;
      }
      // Match splat route
      else if ("$" in current)
      {
        // Store route value to the proper splat name
        params[current["$"]._splat as string] = route;

        // Match splat route file, end of rendering
        if (current["$"].type == "Route")
        {
          solved.push(current["$"] as RouteModule);
          return [solved, params];
        }
        // Match splat route folder, change context
        current = current["$"] as RoutePart;
      }
      // Doesn't match, end
      else return [solved, params];
    }

    // Path resolution finished but didn't return, try matching layout and index before ending.
    if ("_layout" in current && current["_layout"].type == "Route")
      solved.push(current["_layout"] as RouteModule);
    if ("index" in current && current["index"].type == "Route")
      solved.push(current["index"] as RouteModule);

    return [solved, params];
  }
}

declare global {
  type Context = InstanceType<typeof import("./context.js").Context>;
  var Context: typeof import("./context.js").Context;
}

global.Context = Context;