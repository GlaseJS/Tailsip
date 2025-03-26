


import { App } from "./app";

export type Options = {
  mode?: "development" | "production",
  format?: (type: string, message: string) => string,
  logLevel?: "all" | "warn" | "error"
}

export const DefaultOptions: Required<Options> = {
  mode: process.env.NODE_ENV as any || "development",
  format: (type, message) => `${new Date().toISOString()} [${type.toUpperCase()}]: ${message}`,
  logLevel: "all"
}

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
}

export type Component = (app: App, opts: Required<Options>) => Returns;

declare module "./app" {
  interface Config {
    logger: Options
  }

  interface App {
    logger?: Returns
  }
}


