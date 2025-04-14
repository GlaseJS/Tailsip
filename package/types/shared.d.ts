
/// <reference types="node" />

declare type Wrapper =
  typeof $void |
  ReturnType<typeof $json> |
  ReturnType<typeof $text> |
  ReturnType<typeof $view> |
  ReturnType<typeof $file>;

declare type JsonValue = number | string | boolean | null | JsonValue[] | JsonObject;
declare type JsonObject = { [x: string]: JsonValue };



declare type TitleHandler = string;
declare type MetaHandler = (
  { type: "script", src: string } |
  { type: "link", rel: string, href: string, format?: string, as?: string } |
  { type: "meta", name: string, content: string } |
  { type: "charset", value: string }
)[];
declare type LangHandler = (ctx: Context) => string;



declare type APIHandlerReturns = JsonObject | void;
declare type APIHandler = (ctx: Context) => Promise<APIHandlerReturns>;



declare type SocketEmitter = (event: string, data?: any) => void;
declare type SocketHandlerArgs = {
  /** Emit an event in the general room **/
  emit: SocketEmitter,
  /**  **/
  to: (socket: string) => { emit: SocketEmitter },
  room: (name: string) => { join: () => void, emit: SocketEmitter }
}
declare type SocketHandlerReturns = {
  [event: string]: (from: string, data: any) => any;
}
declare type SocketHandler = (ctx: SocketHandlerArgs) => SocketHandlerReturns;



declare type ViewHandlerReturns = string;
declare type ViewHandler = (ctx: Context, next: () => string) => ViewHandlerReturns;



declare type StyleHandlerReturns = string;
declare type StyleHandler = (ctx: Context) => StyleHandlerReturns;



declare type ClientHandlerArgs = {
  emit: SocketEmitter,
  room: (name: string) => { join: () => void, emit: SocketEmitter },
  fetch: (route?: string) => Promise<any>,
  store: {
    set: (id: string, value: any) => void,
    get: (id: string) => any
  }
}
declare type ClientHandlerReturns = {
  /** Page event **/
  [x: `page:${string}`]: () => any,
  /** Socket event **/
  [x: `on:${string}`]: (data?: any) => any,
  /** DOM event **/
  [x: 
    `#${string}:${string}` | // id
    `.${string}:${string}` | // class
    `$:${string}` // scope
  ]: () => any
}
declare type ClientHandler = (ctx: ClientHandlerArgs) => ClientHandlerReturns;



declare type ErrorHandler<Replacement extends (...args: any) => any> = (err: any) => (...args: Parameters<Replacement>) => ReturnType<Replacement>;
