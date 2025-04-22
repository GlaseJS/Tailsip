
import type { Server as httpServer } from "node:http";
import type { Server as httpsServer } from "node:https";

export type Options = {
  maxSize?: number,
  address?: string
}

export const DefaultOptions: Required<Options> = {
  maxSize: 49152,
  address: "",
} as any;

export type Returns = {
  host: (server: httpServer | httpsServer, opts: {
    allowedOrigins?: string[]
  }) => void,
  client: () => string
};

export type Component = (opts: Required<Options>) => Returns;

declare module "../core/interfaces.js" {
  interface Config {
    socket: Options
  }

  interface App {
    socket?: Returns
  }

  interface Overrides {
    socket?: Component
  }
}


