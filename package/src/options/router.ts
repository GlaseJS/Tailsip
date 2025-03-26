


import type { IncomingMessage, ServerResponse } from "node:http";
import { App } from "./app";

export type Options = {
  folder?: string
}

export const DefaultOptions: Required<Options> = {
  folder: "routes"
} as any;

export type Context = {
  request: IncomingMessage,
  response: ServerResponse,
  body?: string
};

export type Returns = {
  get:  (ctx: Context) => Promise<void>,
  post: (ctx: Context) => Promise<void>
}

export type Component = (app: App, opts: Options) => Returns;

declare module "./app" {
  interface Config {
    router: Options
  }

  interface App {
    router?: Returns
  }
}


