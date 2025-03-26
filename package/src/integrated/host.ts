


import { Host as _} from "../options";

import http from "node:http";
import https from "node:https";
import fs from "node:fs";

export const Host: _.Component = (app, opts) => {
  const logger = app.logger("host");



  const handler = async (request: http.IncomingMessage, response: http.ServerResponse) => {
    let body = "";

    logger.log(`[${request.method}] ${request.url}`);
    
    const end = (code: number, answer?: string | Json, headers?: Headers) => {
      response.statusCode = code;
      if (headers) response.setHeaders(headers);
      if (typeof answer == "string") response.end(answer);
      else                           response.end(JSON.stringify(answer));
    }

    if (request.method == "GET")
    {
      // Todo: Treat request
    }
    else if (request.method == "POST")
    {
      request.on("error", () => end(500));

      request.on("data", (chunk) => {
        if (body.length + chunk.length > 1e6) end(400);
        body += chunk;
      });

      request.on("end", () => {
        // TODO: Treat request
      })
    }

    response.statusCode = 404;
    response.end();
  }



  const httpServer = opts.http ? http.createServer(handler) : null;
  let httpsServer: https.Server;
  try {
    const httpsOpts = {
      key: fs.readFileSync(opts.httpsOpts.key),
      cert: fs.readFileSync(opts.httpsOpts.cert),
    }
    httpsServer = opts.https ? https.createServer(httpsOpts, handler) : null;
  } catch(_) {}

  return () => {
    process.on("exit", () => {
      httpServer?.close();
      httpsServer?.close();
    });

    httpsServer?.listen(opts.httpsPort);
    httpServer?.listen(opts.httpPort);

    logger.log(`Host listening.`);
  }
}


