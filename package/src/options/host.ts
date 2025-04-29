


export type Options = {
  protocol?: "http" | "https",
  host?: string,
  port?: number,

  key?: string,
  cert?: string,

  corsPolicy?: "strict" | "lax",
  allowedOrigins?: string[],

  textCachingDuration?: number
  viewCachingDuration?: number
  jsonCachingDuration?: number
  staticCachingDuration?: number
}

export const DefaultOptions: Required<Options> = {
  protocol:  process.env.NODE_ENV == "production" ? "https" : "http",
  host:      process.env.NODE_ENV == "production" ? ""      : "localhost",
  port:      process.env.NODE_ENV == "production" ? 443     : 80,

  key:  "XYZ.key",
  cert: "ABC.crt",

  corsPolicy:     process.env.NODE_ENV == "production" ? "strict" : "lax",
  allowedOrigins: process.env.NODE_ENV == "production" ? []       : ["*"],

  textCachingDuration:   process.env.NODE_ENV == "production" ? 7*24*60*60 : 0, // 7 days
  viewCachingDuration:   process.env.NODE_ENV == "production" ? 7*24*60*60 : 0, // 7 days
  jsonCachingDuration:   process.env.NODE_ENV == "production" ? 8*60*60 : 0,    // 8h
  staticCachingDuration: process.env.NODE_ENV == "production" ? 30*24*6060 : 0, // 30 days
};

export type Returns = () => void;

export type Component = (opts: Required<Options>) => ({
  
});

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


