


export type Options = {
  routesFolder: string
}

export const DefaultOptions: Required<Options> = {
  routesFolder: "routes"
} as any;

declare module "../core/interfaces.js" {
  interface Config {
    tailsip: Options
  }
}


