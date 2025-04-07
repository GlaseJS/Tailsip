export type Options = {
    protocol?: "http" | "https";
    host?: string;
    port?: number;
    key?: string;
    cert?: string;
    corsPolicy: "strict" | "lax";
    allowedOrigins: string[];
};
export declare const DefaultOptions: Required<Options>;
export type Returns = () => void;
export type Component = (opts: Required<Options>) => Returns;
declare module "../core/interfaces.js" {
    interface Config {
        host: Options;
    }
    interface App {
        host?: Returns;
    }
    interface Overrides {
        host?: Component;
    }
}
