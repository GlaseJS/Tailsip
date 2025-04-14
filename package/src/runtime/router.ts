


import { Router as _ } from "../options/index.js";
import fs from "node:fs";

const loaders: { [x: string]: ReturnType<typeof Register["Loader"]> } = {};
const routes: { [x: string]: Partial<ReturnType<typeof Register["Route"]>> } = {};
const components: { [x: string]: Partial<ReturnType<typeof Register["Component"]>>  } = {};

/** Defines wrapper for certain user provided methods */
const Register = ({
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
  Loader: (path: string, loader: APIHandler) => ({
      
  }),
  Route: (path: string, md: RouteModule) => {
     
    return ({
      ...md, ...Register.View(`view:${path}`, md)
    })

  },
  Component: (path: string, md: ComponentModule) => {
    return ({
      ...md, ...Register.View(`component:${path}`, md)
    })
  }
})

/** Load and Compile modules**/
const Compile = async (folder: string, route: string) => 
{
  const content = fs.readdirSync(folder);

  for (const file of content)
  {
    const fullPath = `${folder}/${file}`;
    const stats = fs.statSync(fullPath);

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
      await Compile(fullPath, ownRoute);
      if (isSplat)
      {
        const layoutPath = `${ownRoute}/$/_layout`;
        if (!routes[layoutPath]) routes[layoutPath] = {};

        routes[layoutPath]._splat = splatName;
      }
    }
    else if (!isComponent)
    {
      const routeModule = await import(`file://${process.cwd()}/${fullPath}`) as RouteModule;
      routeModule._splat = splatName;
      routes[ownRoute] = Register.Route(ownRoute, routeModule);
    }
    else
    {
      const componentModule = await import(`file://${process.cwd()}/${fullPath}`) as ComponentModule;
      components[ownRoute] = Register.Component(ownRoute, componentModule);
    }
  }
}

await Compile(Config.router.routesFolder, "");


export const Router: _.Component = (opts) => {
  const logger = App.logger!("Router");

  return ({
    GET: async (ctx: Context) => {
      let loaderError: ErrorHandler<APIHandler> = (err) => async () => logger.error(err);
      let finalView = "";

      // First run the loaders and aggregate views
      for (const route of ctx.routes)
      {
        loaderError = route.error?.loader || route.error?.$ || loaderError;
        if (route.loader)
        {
          try 
          {
            const res = await route.loader(ctx);
            if (res) return $json(res);
          } 
          catch(e:any)
          {
            const res = await loaderError(e)(ctx);
            if (res) return $json(res);

            if (route.error?.view) route.error?.view(e)(ctx, () => "");
            break;
          }
        }
      }

      // Then resolve routes backward for views and styles.
      for (let i = ctx.routes.length-1; i >= 0; i--)
      {
        const route = ctx.routes[i];
        finalView = route.view?.(ctx, () => finalView) || finalView;

        if (route.title && !ctx.title) ctx.title = route.title;
        if (route.meta)   ctx.meta.push(...route.meta);
        if (route.lang)   ctx.lang = route.lang(ctx);

        if (route.style)  ctx.meta.push({ type: "link", rel: "stylesheet", href: `${ctx.url}.css` });
        if (route.client) ctx.meta.push({ type: "script", src: `${ctx.url}.js` });
      }

      if (finalView != "") 
      {
        return $view(`
        <html${ctx.lang ? ` lang="${ctx.lang}"` : ""}>
        <head>
          ${ ctx.meta.map((meta => {
            if (meta.type == "meta")
              return `<meta name="${meta.name}" content="${meta.content}">\n`;
            if (meta.type == "charset")
              return `<meta charset="${meta.value}">\n`;
            if (meta.type == "link")
              return `<link rel="${meta.rel}" href="${meta.href}"${meta.format? ` type="${meta.format}"` : ""}${meta.as? ` as="${meta.as}"` : ""}>\n`;
            if (meta.type == "script")
              return `<script src="${meta.src}">\n`;
          })) }
        </head>
        <body>
          ${finalView}
        </body>
        </html>
        `);
      }

      // No view nor loader returns => route didn't trigger a resolve.
      return $void;
    },

    FILE: async (ctx: Context) => {
      if (!ctx.fileType) return $void;

      // Serve style and client methods
      if (ctx.fileType == "css")
      {
        const route = ctx.routes[ctx.routes.length-1];
        if (route.style) return $text(route.style(ctx));
      }
      else if (ctx.fileType == "js")
      {
        const route = ctx.routes[ctx.routes.length-1];
        if (route.client) return $text(route.client.toString());
      }

      // Serve static files
      const file = `${Config.router.staticFolder}/${ctx.url.pathname}`;
      if (fs.existsSync(file)) return $file(file);

      return $void;
    },

    POST: async (ctx: Context) => {
      let actionError: ErrorHandler<APIHandler> = (err) => async () => logger.error(err);
      const route = ctx.routes[ctx.routes.length-1];

      actionError = route.error?.action || route.error?.$ || actionError;
      if (route.action)
      {
        try
        {
          const res = await route.action(ctx);
          if (res) return $json(res);
        }
        catch(e:any)
        {
          const res = await actionError(e)(ctx);
          if (res) return $json(res);
        }
      }

      return $void;
    }
  });
}

