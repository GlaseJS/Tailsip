


export type Options = {
  protocol?: "http" | "https",
  host?: string,
  port?: number,

  key?: string,
  cert?: string,

  corsPolicy: "strict" | "lax",
  allowedOrigins: string[],
}

export const DefaultOptions: Required<Options> = {
  protocol:  process.env.NODE_ENV == "production" ? "https" : "http",
  host:      process.env.NODE_ENV == "production" ? ""      : "localhost",
  port:      process.env.NODE_ENV == "production" ? 443     : 80,

  key: "XYZ.key",
  cert: "ABC.crt",

  corsPolicy: process.env.NODE_ENV == "production" ? "strict" : "lax",
  allowedOrigins: process.env.NODE_ENV == "production" ? [] : ["*"],
} as any;

export type Returns = () => void;

export type Component = (opts: Required<Options>) => Returns;

declare module "../core/interfaces.js" {
  interface Config {
    host: Options
  }

  interface App {
    host?: Returns
  }

  interface Overrides {
    host?: Component
  }
}


