


import { App } from "./app";

export type Options = {
}

export const DefaultOptions: Required<Options> = {
} as any;

declare module "./app" {
  interface Config {
    tailsip: Options
  }
}


