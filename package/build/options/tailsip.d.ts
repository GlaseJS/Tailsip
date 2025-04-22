export type Options = {
    idTokenLength?: number;
    idTokenCacheSize?: number;
    routesFolder?: string;
    staticFolder?: string;
    componentsFolder?: string;
};
export declare const DefaultOptions: Required<Options>;
declare module "../core/interfaces.js" {
    interface Config {
        tailsip: Options;
    }
}
