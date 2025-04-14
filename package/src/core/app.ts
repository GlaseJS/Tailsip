


import { readdirSync, statSync } from "node:fs";

import { Logger } from "../runtime/logger.js";
import { Router } from "../runtime/router.js";
import { Host } from "../runtime/host.js";

import { App as Interface } from "./interfaces.js";

export interface App extends Interface {
  routes: { [x: string]: RouteModule };
  components: { [x: string]: ComponentModule };
  address: string;
}
export class App
{
  /** Defines wrapper for certain user provided methods */
  Register = ({
    View: (path: string, md: ComponentModule) => ({

      view: (ctx: Context, next: () => string) =>
      {
        const id = ctx.GenerateElementId();
        const fullPath = md.scoped ? `${path}#${id}` : path;

        if (md.style)  ctx.meta.push({ type: "link", rel: "stylesheet", href: `${fullPath}.css` });
        if (md.client) ctx.meta.push({ type: "script", src: `${fullPath}.js` });
        return md.view?.(ctx, next).replace(">", `id="${id}">`);
      },
      client:
        (id: string) =>
          md.client?.toString().replace(/(["'])\$:([a-zA-Z]+)\1/gm, (_, quote, event) => `"#${id}:${event}"`),
      style:
        (id: string) => md.scoped ?
          (ctx: Context) => md.style?.(ctx).replace(/^(.*{\s*)$/gm, (_, line) => `#${id} ${line}`) :
          md.style
      
    }),
    Route: (path: string, md: RouteModule) => {

      return ({
        ...md, ...this.Register.View(`view:${path}`, md)
      })

    },
    Component: (path: string, md: ComponentModule) => {
      return ({
        ...md, ...this.Register.View(`component:${path}`, md)
      })
    }
  })

  /** Load and Compile modules**/
  async Compile(folder: string, route: string)
  {
    const content = readdirSync(folder);

    for (const file of content)
    {

      const fullPath = `${folder}/${file}`;
      const stats = statSync(fullPath);

      const isSplat = file.startsWith("$");
      let base = file.endsWith(".js") ? file.slice(0, -3) : file;

      const componentRegex = base.match(/^(.*)\.components?$/);
      const isComponent = !!componentRegex;
      base = componentRegex?.[1] || base;

      const name = isSplat ? "$" : base;
      const splatName = isSplat ? base.slice(1) : "";

      const ownRoute = `${route}/${name}`;

      if (stats.isDirectory())
      {
        await this.Compile(fullPath, ownRoute);

        if (isSplat)
        {
          const layoutPath = `${ownRoute}/$/_layout`;
          if (!this.routes[layoutPath]) this.routes[layoutPath] = {};

          this.routes[layoutPath]._splat = splatName;
        }
      }
      else if (!isComponent)
      {
        const routeModule = await import(`file://${process.cwd()}/${fullPath}`) as RouteModule;
        routeModule._splat = splatName;
        this.routes[ownRoute] = routeModule;
      }
      else
      {
        const componentModule = await import(`file://${process.cwd()}/${fullPath}`) as ComponentModule;
        this.components[ownRoute] = componentModule;
      }
    }
  }
}

declare global {
  var App: InstanceType<typeof import("./app.js").App>;
  type App = typeof import("./app.js").App;
}

const app = new App();
await app.Compile(Config.tailsip.routesFolder, "");

global.App = app;
global.App.logger = Overrides.logger?.(Config.logger) || Logger(Config.logger);
global.App.router = Overrides.router?.(Config.router) || Router(Config.router);
global.App.host   = Overrides.host?.(Config.host)     || Host  (Config.host);

global.App.host();