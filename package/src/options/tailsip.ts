


export type Options = {
  idTokenLength: number,
  idTokenCacheSize: number
}

export const DefaultOptions: Required<Options> = {
  idTokenLength: 8,
  idTokenCacheSize: 200
} as any;

declare module "../core/interfaces.js" {
  interface Config {
    tailsip: Options
  }
}


