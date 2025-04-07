export type Options = {
    routesFolder: string;
};
export declare const DefaultOptions: Required<Options>;
declare module "../core/interfaces.js" {
    interface Config {
        tailsip: Options;
    }
}
