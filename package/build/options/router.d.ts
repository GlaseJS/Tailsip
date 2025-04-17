import type { Context } from "../runtime/router/context.js";
export type Options = {
    routesFolder: string;
    staticFolder: string;
};
export declare const DefaultOptions: Required<Options>;
export type Returns = {
    GET: (ctx: ConstructorParameters<typeof Context>) => Promise<Wrapper>;
    POST: (ctx: ConstructorParameters<typeof Context>) => Promise<Wrapper>;
    FILE: (ctx: ConstructorParameters<typeof Context>) => Promise<Wrapper>;
};
export type Component = (opts: Options) => Returns;
declare module "../core/interfaces.js" {
    interface Config {
        router: Options;
    }
    interface App {
        router?: Returns;
    }
    interface Overrides {
        router?: Component;
    }
}
