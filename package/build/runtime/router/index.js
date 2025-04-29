var __addDisposableResource = (this && this.__addDisposableResource) || function (env, value, async) {
    if (value !== null && value !== void 0) {
        if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
        var dispose, inner;
        if (async) {
            if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
            dispose = value[Symbol.asyncDispose];
        }
        if (dispose === void 0) {
            if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
            dispose = value[Symbol.dispose];
            if (async) inner = dispose;
        }
        if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
        if (inner) dispose = function() { try { inner.call(this); } catch (e) { return Promise.reject(e); } };
        env.stack.push({ value: value, dispose: dispose, async: async });
    }
    else if (async) {
        env.stack.push({ async: true });
    }
    return value;
};
var __disposeResources = (this && this.__disposeResources) || (function (SuppressedError) {
    return function (env) {
        function fail(e) {
            env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
            env.hasError = true;
        }
        var r, s = 0;
        function next() {
            while (r = env.stack.pop()) {
                try {
                    if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
                    if (r.dispose) {
                        var result = r.dispose.call(r.value);
                        if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
                    }
                    else s |= 1;
                }
                catch (e) {
                    fail(e);
                }
            }
            if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
            if (env.hasError) throw env.error;
        }
        return next();
    };
})(typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
import { usesSockets } from "../compiler.js";
import { Context } from "../context.js";
import { client } from "./client.js";
import { reset } from "./reset.js";
import fs from "node:fs";
export const Router = (opts) => {
    const logger = App.logger("router");
    return ({
        GET: async (req) => {
            const env_1 = { stack: [], error: void 0, hasError: false };
            try {
                const ctx = __addDisposableResource(env_1, new Context(...req), false);
                let finalView = "";
                const route = ctx.getRoute();
                if (!route)
                    return $void; //404
                for (const loader of route.loader) {
                    try {
                        await loader(ctx);
                    }
                    catch (e) {
                        return $json(await route.error?.loader?.(e)(ctx) || {});
                    }
                }
                for (const view of route.view) {
                    try {
                        finalView = view(ctx, () => finalView);
                    }
                    catch (e) {
                        finalView = route.error?.view?.(e)(ctx, () => finalView) || "";
                    }
                }
                if (finalView != "") {
                    return $view(`
        <html${ctx.lang ? ` lang="${ctx.lang}"` : ""}>
          <head>
            ${usesSockets ? `<script src="/socket.js"></script>` : ""}
            <script src="/main.js"></script>
            <link rel="stylesheet" href="/reset.css">
            ${ctx.meta.map((meta => {
                        if (meta.type == "meta")
                            return `<meta name="${meta.name}" content="${meta.content}">`;
                        if (meta.type == "charset")
                            return `<meta charset="${meta.value}">`;
                        if (meta.type == "link")
                            return `<link rel="${meta.rel}" href="${meta.href}"${meta.format ? ` type="${meta.format}"` : ""}${meta.as ? ` as="${meta.as}"` : ""}>`;
                        if (meta.type == "script")
                            return `<script src="${meta.src}"></script>`;
                        return '';
                    })).join("")}
          </head>
          <body>
            ${finalView}
          </body>
        </html>
        `);
                }
                return $void;
            }
            catch (e_1) {
                env_1.error = e_1;
                env_1.hasError = true;
            }
            finally {
                __disposeResources(env_1);
            }
        },
        FILE: async (req) => {
            const env_2 = { stack: [], error: void 0, hasError: false };
            try {
                const ctx = __addDisposableResource(env_2, new Context(...req), false);
                if (!ctx.fileType)
                    return $void; // We don't wrap when the request isn't a file.
                const routeModule = ctx.getRoute();
                // Serve style and client methods
                if (ctx.fileType == "css" && ctx.route == "/reset")
                    return $text(reset);
                if (ctx.fileType == "css" && routeModule?.style)
                    return $text(routeModule.style(ctx.id)(ctx));
                else if (ctx.fileType == "js" && ctx.route == "/main")
                    return $text(client);
                else if (usesSockets && ctx.fileType == "js" && ctx.route == "/socket" && App.socket)
                    return $text(App.socket.client());
                else if (ctx.fileType == "js" && routeModule?.client)
                    return $text(`$(${routeModule.client(ctx.id)});`);
                // Serve static files
                const file = `${Config.tailsip.staticFolder}/${ctx.url.pathname}`;
                if (fs.existsSync(file))
                    return $file(file);
                return $void;
            }
            catch (e_2) {
                env_2.error = e_2;
                env_2.hasError = true;
            }
            finally {
                __disposeResources(env_2);
            }
        },
        POST: async (req) => {
            const env_3 = { stack: [], error: void 0, hasError: false };
            try {
                const ctx = __addDisposableResource(env_3, new Context(...req), false);
                let actionError = (err) => async () => logger.error(err);
                const route = ctx.getRoute();
                if (!route)
                    return $void;
                actionError = route.error?.action || route.error?.$ || actionError;
                if (route.action) {
                    try {
                        const res = await route.action(ctx);
                        if (res)
                            return $json(res);
                    }
                    catch (e) {
                        const res = await actionError(e)(ctx);
                        if (res)
                            return $json(res);
                    }
                }
                return $void;
            }
            catch (e_3) {
                env_3.error = e_3;
                env_3.hasError = true;
            }
            finally {
                __disposeResources(env_3);
            }
        }
    });
};
