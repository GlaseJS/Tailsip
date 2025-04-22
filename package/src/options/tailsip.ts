


export type Options = {
  idTokenLength?: number,
  idTokenCacheSize?: number,
  
  routesFolder?: string,
  staticFolder?: string,
  componentsFolder?: string,
}

export const DefaultOptions: Required<Options> = {
  idTokenLength: 8,
  idTokenCacheSize: 200,

  routesFolder: "routes",
  staticFolder: "public",
  componentsFolder: "components",
} as any;

declare module "../core/interfaces.js" {
  interface Config {
    tailsip: Options
  }
}


