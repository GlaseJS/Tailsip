


import { Router as _ } from "../../options/index.js";
import { usesSockets } from "../compiler.js";
import { Context } from "../context.js";

import { client } from "./client.js";
import { reset } from "./reset.js";

import fs from "node:fs";

export const Router: _.Component = (opts) => {
  const logger = App.logger!("router");
      

  return ({
    GET: async (req) => {
      const ctx = new Context(...req);
      let finalView = "";

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
            ${ usesSockets ? `<script src="/socket.js"></script>` : "" }
            <script src="/main.js"></script>
            <link rel="stylesheet" href="/reset.css">
            ${ ctx.meta.map((meta => {
              if (meta.type == "meta")
                return `<meta name="${meta.name}" content="${meta.content}">`;
              if (meta.type == "charset")
                return `<meta charset="${meta.value}">`;
              if (meta.type == "link")
                return `<link rel="${meta.rel}" href="${meta.href}"${meta.format? ` type="${meta.format}"` : ""}${meta.as? ` as="${meta.as}"` : ""}>`;
              if (meta.type == "script")
                return `<script src="${meta.src}"></script>`;
              return '';
            })).join("") }
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
      if (!ctx.fileType) return $void; // We don't wrap when the request isn't a file.

      // Serve style and client methods
      if (ctx.fileType == "css" && ctx.route == "/reset")
        return $text(reset);
      if (ctx.fileType == "css" && ctx.routeModule?.style)
        return $text(ctx.routeModule.style(ctx.id)!(ctx));
      else if (ctx.fileType == "js" && ctx.route == "/main")
        return $text(client);
      else if (usesSockets && ctx.fileType == "js" && ctx.route == "/socket" && App.socket)
        return $text(App.socket!.client());
      else if (ctx.fileType == "js" && ctx.routeModule?.client)
        return $text(`$(${ctx.routeModule.client(ctx.id)});`);

      // Serve static files
      const file = `${Config.tailsip.staticFolder}/${ctx.url.pathname}`;
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

