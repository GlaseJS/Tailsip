import * as _ from "../options/index.js";
global.Config = ({
    tailsip: _.Core.DefaultOptions,
    logger: _.Logger.DefaultOptions,
    router: _.Router.DefaultOptions,
    host: _.Host.DefaultOptions
});
const userConfig = require(`${process.cwd()}/tailsip.config.json`);
const envConfig = require(`${process.cwd()}/tailsip.config.env.json`);
const load = (on, config) => {
    for (const thing in config) {
        if (!(thing in on))
            on[thing] = config[thing];
        else if (typeof config[thing] == "object")
            load(on[thing], config[thing]);
        else
            on[thing] = config[thing];
    }
};
load(global.Config, userConfig);
load(global.Config, envConfig);
global.TSConfig = {
    ...require(`${process.cwd()}/tsconfig.json`)
};
