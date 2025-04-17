export type Options = {
    idTokenLength: number;
    idTokenCacheSize: number;
};
export declare const DefaultOptions: Required<Options>;
declare module "../core/interfaces.js" {
    interface Config {
        tailsip: Options;
    }
}
