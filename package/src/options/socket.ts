
import type { Server as httpServer } from "node:http";
import type { Server as httpsServer } from "node:https";

export type Options = {
  maxSize?: number,
  address?: string,

  roomAutoEmit?: boolean,
  socketTimeoutMS?: number,
  socketPingMS?: number
  socketLogFrequency?: number
}

export const DefaultOptions: Required<Options> = {
  maxSize: 49152,
  address: "",

  roomAutoEmit: true,
  socketTimeoutMS: 5*60*1000, // 5 mins
  socketPingMS: 30*1000, // 30 secs
  socketLogFrequency: 10, // Log every 10 Pings
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


