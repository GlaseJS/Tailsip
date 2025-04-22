import http from "node:http";
import https from "node:https";
import fs from "node:fs";
import { $ } from "../libs/ansi.js";
import { padRight } from "../libs/strings.js";
import { Timer } from "../libs/timer.js";
export const Host = (opts) => {
    const logger = App.logger("host");
    const allowedOrigins = [...opts.allowedOrigins];
    const handler = async (request, response) => {
        const timer = new Timer();
        let body = "";
        const headers = new Headers();
        const end = (code, answer) => {
            const methodColor = request.method == "GET" ?
                $.green :
                request.method == "POST" ?
                    $.magenta :
                    $.white;
            const codeColor = code > 399 ?
                $.red :
                code > 299 ?
                    $.cyan :
                    code > 199 ?
                        $.green :
                        $.white;
            if (request.url) {
                const pathLength = request.url.lastIndexOf("/") - request.url.indexOf("/") + 1;
                logger.log(`${methodColor}${request.method}${$.reset} ${padRight(request.url, pathLength + 20).replace(/\//g, $.white + "/" + $.reset)}  ::  ${codeColor}${code}${$.reset}  (${timer})`);
            }
            response.statusCode = code;
            response.setHeaders(headers);
            return response.end(answer);
        };
        const resolve = (wrap) => {
            if (wrap.type == "File") {
                headers.append("Cache-Control", opts.staticCachingDuration > 0 ?
                    `public, max-age=${opts.staticCachingDuration}` :
                    "no-cache");
                const stream = wrap.resolve();
                stream.pipe(response);
                stream.on("end", () => {
                    response.end();
                });
            }
            else if (wrap.type == "Json") {
                headers.append("Content-Type", "application/json");
                headers.append("Cache-Control", opts.jsonCachingDuration > 0 ?
                    `public, max-age=${opts.jsonCachingDuration}` :
                    "no-cache");
                end(200, wrap.resolve());
            }
            else if (wrap.type == "View") {
                headers.append("Content-Type", "text/html");
                headers.append("Cache-Control", opts.viewCachingDuration > 0 ?
                    `public, max-age=${opts.viewCachingDuration}` :
                    "no-cache");
                end(200, wrap.resolve());
            }
            else if (wrap.type == "Text") {
                headers.append("Content-Type", "text/plain");
                headers.append("Cache-Control", opts.textCachingDuration > 0 ?
                    `public, max-age=${opts.textCachingDuration}` :
                    "no-cache");
                end(200, wrap.resolve());
            }
            else {
                end(404);
            }
        };
        /**
         * CORS
         */
        const origin = request.headers.origin;
        if (origin && allowedOrigins.includes(new URL(origin).hostname))
            headers.append("Access-Control-Allow-Origin", origin);
        else if (opts.corsPolicy == "strict")
            // Missing or unallowed origin on strict cors policy => end
            return end(403, undefined);
        /**
         * OPTIONS
         */
        if (request.method === "OPTIONS") {
            headers.append("Access-Control-Allow-Headers", "Content-Type, Accept, Origin, Authorization");
            headers.append("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            return end(204, undefined);
        }
        /**
         * GET
         */
        else if (request.method == "GET") {
            const res = await App.router.FILE([request, response, headers]);
            if (res.type != "Void")
                return resolve(res);
            return resolve(await App.router.GET([request, response, headers]));
        }
        /**
         * POST
         */
        else if (request.method == "POST") {
            request.on("error", () => end(500));
            request.on("data", (chunk) => {
                if (body.length + chunk.length > 1e6) {
                    request.destroy();
                    return end(400);
                }
                body += chunk;
            });
            request.on("end", async () => {
                return resolve(await App.router.POST([request, response, headers, JSON.parse(body)]));
            });
        }
        else {
            return resolve($void);
        }
    };
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
        let { address, port } = server.address();
        address = address == "::" ? "localhost" : address;
        allowedOrigins.push(address);
        App.address = new URL(`${opts.protocol}://${address}:${port}`);
        App.socket.host(server, {
            allowedOrigins
        });
        console.log(`\n${$.cyan}      _______       _____ _       _____ _____ _____  
     |__   __|/\\   |_   _| |     / ____|_   _|  __ \\ 
        | |  /  \\    | | | |    | (___   | | | |__) |
        | | / /\\ \\   | | | |     \\___ \\  | | |  ___/ 
        | |/ ____ \\ _| |_| |____ ____) |_| |_| |     
        |_/_/    \\_\\_____|______|_____/|_____|_|${$.reset}\n\n` +
            `       >>> ${$.white}Server running on ${$.blue}${App.address}${$.reset} <<< \n`);
    };
};
