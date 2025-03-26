import * as _ from "../options";

type FullConfig<T> = { [x in keyof T]: Required<T[x]> };

export const Config: FullConfig<_.App.Config> = ({
  tailsip: _.Core.DefaultOptions,
  logger:  _.Logger.DefaultOptions,
  router:  _.Router.DefaultOptions,
  host:    _.Host.DefaultOptions,

  ...require(`${process.cwd()}/tailsip.config.json`),
  ...require(`${process.cwd()}/tailsip.config.env.json`)
});