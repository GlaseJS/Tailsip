



import { Logger } from "../runtime/logger.js";
import { Router } from "../runtime/router/index.js";
import { Host } from "../runtime/host.js";

import { App as Interface } from "./interfaces.js";

export interface App extends Interface {
  address: string;
}
export class App
{
}

declare global {
  var App: InstanceType<typeof import("./app.js").App>;
  type App = typeof import("./app.js").App;
}

const app = new App();

global.App = app;
global.App.logger = Overrides.logger?.(Config.logger) || Logger(Config.logger);
global.App.router = Overrides.router?.(Config.router) || Router(Config.router);
global.App.host   = Overrides.host?.(Config.host)     || Host  (Config.host);

global.App.host();