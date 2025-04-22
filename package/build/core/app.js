import { Logger } from "../runtime/logger.js";
import { Socket } from "../runtime/socket/index.js";
import { Router } from "../runtime/router/index.js";
import { Host } from "../runtime/host.js";
export class App {
}
const app = new App();
global.App = app;
global.App.logger = Overrides.logger?.(Config.logger) || Logger(Config.logger);
global.App.socket = Overrides.socket?.(Config.socket) || Socket(Config.socket);
global.App.router = Overrides.router?.(Config.router) || Router(Config.router);
global.App.host = Overrides.host?.(Config.host) || Host(Config.host);
global.App.host();
