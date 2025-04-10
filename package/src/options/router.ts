


export type Options = {
  static: string
}

export const DefaultOptions: Required<Options> = {
  static: "public"
} as any;

export type Returns = {
  GET: (ctx: Context) => Promise<Wrapper>;
  POST: (ctx: Context) => Promise<Wrapper>;
  FILE: (ctx: Context) => Promise<Wrapper>;
};

export type Component = (opts: Options) => Returns;

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


