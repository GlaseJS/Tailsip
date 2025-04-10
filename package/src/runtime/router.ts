


import { Router as _ } from "../options/index.js";
import fs from "node:fs";

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
      const file = `${process.cwd}/${Config.router.static}/${ctx.url.pathname.replaceAll("..", "")}`;
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

