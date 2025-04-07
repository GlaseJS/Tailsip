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
  host:    _.Host.DefaultOptions,

  ...require(`${process.cwd()}/tailsip.config.json`),
  ...require(`${process.cwd()}/tailsip.config.env.json`)
});

global.TSConfig = {
  ...require(`${process.cwd()}/tsconfig.json`)
}