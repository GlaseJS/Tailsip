
import type { Context } from "../runtime/context.js";

export type Options = {
}

export const DefaultOptions: Required<Options> = {
} as any;

export type Returns = {
  GET:  (ctx: ConstructorParameters<typeof Context>) => Promise<Wrapper>;
  POST: (ctx: ConstructorParameters<typeof Context>) => Promise<Wrapper>;
  FILE: (ctx: ConstructorParameters<typeof Context>) => Promise<Wrapper>;
};

export type Component = (opts: Required<Options>) => Returns;

declare module "../core/interfaces.js" {
  interface Config {
    router: Options
  }

  interface App {
    router?: Returns
  }

  interface Overrides {
    router?: Component
  }
}


