


import { Host as _ } from "../options/index.js";

import http from "node:http";
import https from "node:https";
import fs from "node:fs";

export const Host: _.Component = (opts) => {
  const logger = App.logger!("host");

  const allowedOrigins = [...opts.allowedOrigins];

  const handler = async (request: http.IncomingMessage, response: http.ServerResponse) => {
    let body = "";
    const headers = new Headers();

    logger.log(`[${request.method}] ${request.url}`);
    
    const end = (code: number, answer?: string | JSON) => {
      response.statusCode = code;
      response.setHeaders(headers);
      return response.end(answer);
    }

    const resolve = (wrap: Wrapper) => {
      if (wrap.type == "File")
      {
        const stream = wrap.resolve();
        stream.pipe(response);
        stream.on("end", () => {
          response.end();
        });
      }
      else if (wrap.type == "Json")
      {
        headers.append("Content-Type", "application/json");
        end(200, wrap.resolve());
      }
      else if (wrap.type == "View")
      {
        headers.append("Content-Type", "text/html");
        end(200, wrap.resolve());
      }
      else if (wrap.type == "Text")
      {
        headers.append("Content-Type", "text/plain");
        end(200, wrap.resolve());
      }
      else
      {
        end(404);
      }
    }

    /**
     * CORS
     */
    const origin = request.headers.origin;
    if (origin && allowedOrigins.includes(origin))
    {
      headers.append("Access-Control-Allow-Origin", origin);
    }
    else if (opts.corsPolicy == "strict")
    {
      // Missing or unallowed origin on strict cors policy => end
      return end(403, undefined);
    }
    /**
     * OPTIONS
     */
    if (request.method === "OPTIONS")
    {
      headers.append("Access-Control-Allow-Headers", "Content-Type, Accept, Origin, Authorization");
      headers.append("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      return end(204, undefined);
    }
    /**
     * GET
     */
    else if (request.method == "GET")
    {
      const context = new Context(request, response, headers);
      const res = await App.router!.FILE(context);

      if (res.type != "Void") return resolve(res);
      return resolve(await App.router!.GET(context));
    }
    /**
     * POST
     */
    else if (request.method == "POST")
    {
      request.on("error", () => end(500));

      request.on("data", (chunk) => {
        if (body.length + chunk.length > 1e6)
        {
          request.destroy();
          return end(400);
        }
        body += chunk;
      });

      request.on("end", async () => {
        return resolve(await App.router!.POST(new Context(request, response, headers, JSON.parse(body))));
      });
    }
    else
    {
      return resolve($void);
    }
  }



  const server = opts.protocol == "http" ?
    http.createServer(handler) :
    https.createServer({
      key: fs.readFileSync(opts.key),
      cert: fs.readFileSync(opts.cert),
    }, handler);

  return () => {
    process.on("exit", () => {
      server.close();
    });
    server.listen(opts.port);

    const { address, port } = server.address() as { address: string, port: number };
    App.address = `${opts.protocol}://${address == "::" ? "localhost" : address}:${port}`;
    allowedOrigins.push(App.address);

    logger.log(`Server running on ${App.address}`);
  }
}


