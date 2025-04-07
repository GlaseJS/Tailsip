export type Options = {
    mode?: "development" | "production";
    format?: (type: string, message: string) => string;
    logLevel?: "all" | "warn" | "error";
};
export declare const DefaultOptions: Required<Options>;
export type Returns = (context: string) => {
    /** Logs a single message in the logger's output */
    log: (message: string) => void | Promise<void>;
    /** Logs something identifiable */
    heed: () => void | Promise<void>;
    /** Debug info (stripped in prod) */
    debug: (message: string) => void | Promise<void>;
    /** Logs a warning */
    warn: (message: string) => void | Promise<void>;
    /** Logs an error */
    error: (error: Error) => void | Promise<void>;
};
export type Component = (opts: Required<Options>) => Returns;
declare module "../core/interfaces.js" {
    interface Config {
        logger: Options;
    }
    interface App {
        logger?: Returns;
    }
    interface Overrides {
        logger?: Component;
    }
}
