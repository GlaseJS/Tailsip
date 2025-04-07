


import { readdirSync, statSync } from "node:fs";

import { Logger } from "../runtime/logger.js";
import { Router } from "../runtime/router.js";
import { Host } from "../runtime/host.js";

import { App as Interface } from "./interfaces.js";

export interface App extends Interface {
  routes: RoutePart;
  address: string;
}
export class App
{
  constructor() {
  
  }

  async Compile(folder: string)
  {
    const content = readdirSync(folder);
    let cache: RoutePart = {};

    for (const file of content)
    {
      const fullPath = `${folder}/${file}`;
      const stats = statSync(fullPath);

      const isSplat = file.startsWith("$");
      const base = file.endsWith(".js") ? file.slice(0, -3) : file;
      const name = isSplat ? "$" : base;

      if (stats.isDirectory())
      {
        cache = {
          ...cache,
          [name]: {
            ...await this.Compile(fullPath),
            _splat: name, 
          } as RoutePart
        };
      }
      else
      {
        const routeModule = {
          ...await import(`file://${process.cwd()}/${fullPath}`) as RouteModule,
          type: "Route" as const
        };

        routeModule._splat = isSplat ? base.slice(1) : "";
        cache = {
          ...cache,
          [name]: routeModule
        };
      }
    }

    return cache;
  }
}

declare global {
  var App: InstanceType<typeof import("./app.js").App>;
  type App = typeof import("./app.js").App;
}

const app = new App();
app.routes = await app.Compile(Config.tailsip.routesFolder);

global.App = app;
global.App.logger = Overrides.logger?.(Config.logger) || Logger(Config.logger);
global.App.router = Overrides.router?.(Config.router) || Router(Config.router);
global.App.host   = Overrides.host?.(Config.host)     || Host  (Config.host);

global.App.host();