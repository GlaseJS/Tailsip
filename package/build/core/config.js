import * as _ from "../options/index.js";
global.Config = ({
    tailsip: _.Core.DefaultOptions,
    logger: _.Logger.DefaultOptions,
    router: _.Router.DefaultOptions,
    host: _.Host.DefaultOptions,
    ...require(`${process.cwd()}/tailsip.config.json`),
    ...require(`${process.cwd()}/tailsip.config.env.json`)
});
global.TSConfig = {
    ...require(`${process.cwd()}/tsconfig.json`)
};
