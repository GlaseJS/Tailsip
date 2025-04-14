


export type Options = {
  routesFolder: string
  idTokenLength: number,
  idTokenCacheSize: number
}

export const DefaultOptions: Required<Options> = {
  routesFolder: "routes",
  idTokenLength: 8,
  idTokenCacheSize: 200
} as any;

declare module "../core/interfaces.js" {
  interface Config {
    tailsip: Options
  }
}


