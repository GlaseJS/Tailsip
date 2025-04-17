


import { Router as _ } from "../../options/index.js";
import { Context } from "./context.js";
import fs from "node:fs";

export const Router: _.Component = (opts) => {
  const logger = App.logger!("Router");

  return ({
    GET: async (req) => {
      const ctx = new Context(...req);
      let finalView = "";

      logger.log(`    Route:${ctx.route}`);

      const route = ctx.getRoute();
      if (!route) return $void; //404
      for (const loader of route.loader)
      {
        try { await loader(ctx); }
        catch (e: any) { return $json(await route.error?.loader?.(e)(ctx) || {}); }
      }

      for (const view of route.view)
      {
        try { finalView = view(ctx, () => finalView); }
        catch (e: any) { finalView = route.error?.view?.(e)(ctx, () => finalView) || "" }
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

      return $void;
    },

    FILE: async (req) => {
      const ctx = new Context(...req);
      if (!ctx.fileType) return $void;

      // Serve style and client methods
      if (ctx.fileType == "css")
      {
        if (ctx.routeModule?.style) return $text(ctx.routeModule.style(ctx.id)!(ctx));
      }
      else if (ctx.fileType == "js")
      {
        if (ctx.routeModule?.client) return $text(ctx.routeModule.client.toString());
      }

      // Serve static files
      const file = `${Config.router.staticFolder}/${ctx.url.pathname}`;
      if (fs.existsSync(file)) return $file(file);

      return $void;
    },

    POST: async (req) => {
      const ctx = new Context(...req);
      let actionError: ErrorHandler<APIHandler> = (err) => async () => logger.error(err);
      const route = ctx.routeModule;

      if (!route) return $void;

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

