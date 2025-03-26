import { App as _ } from "../options";

import { Config } from "./config";
import { Logger } from "./logger";
import { Router } from "./router";
import { Host } from "./host";

interface App extends _.App {};
class App
{
  
}

export const Tailsip = (overrides?: Partial<_.App>) => {
  const app = new App();
  app.logger = overrides?.logger || Logger(app, Config.logger);
  app.router = overrides?.router || Router(app, Config.router);
  app.host   = overrides?.host   || Host  (app, Config.host);
}