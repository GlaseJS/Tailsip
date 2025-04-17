import type { CompilerOptions } from "typescript";
import { Config as Interface } from "./interfaces.js";
import * as _ from "../options/index.js";

type FullConfig<T> = { [x in keyof T]: Required<T[x]> };
type TSConfig = {
  compilerOptions?: CompilerOptions,
  include?: string[], exclude?: string[], files?: string[]
}

declare global {
  var Config: FullConfig<Interface>;
  var TSConfig: TSConfig
}

global.Config = ({
  tailsip: _.Core.DefaultOptions,
  logger:  _.Logger.DefaultOptions,
  router:  _.Router.DefaultOptions,
  host:    _.Host.DefaultOptions
});

const userConfig = require(`${process.cwd()}/tailsip.config.json`);
const envConfig = require(`${process.cwd()}/tailsip.config.env.json`);

const load = (on: any, config: any) => {
  for (const thing in config)
  {
    if (!(thing in on)) on[thing] = config[thing];
    else if (typeof config[thing] == "object") load(on[thing], config[thing]);
    else on[thing] = config[thing];
  }
}
load(global.Config, userConfig);
load(global.Config, envConfig);

global.TSConfig = {
  ...require(`${process.cwd()}/tsconfig.json`)
}