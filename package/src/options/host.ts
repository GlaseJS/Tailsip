


import { App } from "./app";

export type Options = {
  http?: boolean,
  httpPort?: number,
  https?: boolean,
  httpsPort?: number,
  httpsOpts?: { key: string, cert: string }
}

export const DefaultOptions: Required<Options> = {
  httpPort:  process.env.NODE_ENV == "production" ? 80    : 3000,
  httpsPort: process.env.NODE_ENV == "production" ? 443   : 3001,
  http:      process.env.NODE_ENV == "production" ? false : true,
  https:     process.env.NODE_ENV == "production" ? true  : false,
  httpsOpts: { key: "XYZ.key", cert: "ABC.crt" }
} as any;

export type Returns = () => void;

export type Component = (app: App, opts: Required<Options>) => Returns;

declare module "./app" {
  interface Config {
    host: Options
  }

  interface App {
    host?: Returns
  }
}


