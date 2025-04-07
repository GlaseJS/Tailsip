import { readdirSync, statSync } from "node:fs";
import { Logger } from "../runtime/logger.js";
import { Router } from "../runtime/router.js";
import { Host } from "../runtime/host.js";
export class App {
    constructor() {
    }
    async Compile(folder) {
        const content = readdirSync(folder);
        let cache = {};
        for (const file of content) {
            const fullPath = `${folder}/${file}`;
            const stats = statSync(fullPath);
            const isSplat = file.startsWith("$");
            const base = file.endsWith(".js") ? file.slice(0, -3) : file;
            const name = isSplat ? "$" : base;
            if (stats.isDirectory()) {
                cache = {
                    ...cache,
                    [name]: {
                        ...await this.Compile(fullPath),
                        _splat: name,
                    }
                };
            }
            else {
                const routeModule = {
                    ...await import(`file://${process.cwd()}/${fullPath}`),
                    type: "Route"
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
const app = new App();
app.routes = await app.Compile(Config.tailsip.routesFolder);
global.App = app;
global.App.logger = Overrides.logger?.(Config.logger) || Logger(Config.logger);
global.App.router = Overrides.router?.(Config.router) || Router(Config.router);
global.App.host = Overrides.host?.(Config.host) || Host(Config.host);
global.App.host();
