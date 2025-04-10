


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
  [x: `#${string}:${string}` | `.${string}:${string}`]: () => any
}
declare type ClientHandler = (ctx: ClientHandlerArgs) => ClientHandlerReturns;



declare type ErrorHandler<Replacement extends (...args: any) => any> = (err: any) => (...args: Parameters<Replacement>) => ReturnType<Replacement>;



declare type RoutePart = {
  [x: string]: RouteModule | RoutePart,
  "_splat"?: string
};

declare type RouteModule = {
  type: "Route",

  /** Changes the title for the rendered page. Deepest title definition is applied.**/
  title?: TitleHandler,
  /** Adds or changes metas for the current page. Applied from closer to deepest from root. **/
  meta?: MetaHandler,

  lang?: LangHandler,

  /** Defines a method to execute on GET calls on this route. **/
  loader?: APIHandler,
  /** Defines an action to execute on POST calls on this route. **/
  action?: APIHandler,
  /** 
   * Defines a list of socket interactions dedicated to this page. <br/>
   * NOTE: sockets on the server are global, this only serves as organisational purpose.
   **/
  socket?: SocketHandler,

  /** Defines a visual element (string) to render for this route. If defined, the route is treated as a view renderer. **/
  view?: ViewHandler,
  /** Defines styles to apply for this page. **/
  style?: StyleHandler,
  /** Defines events to answer to on the client side. Client-side events are page-specific. **/
  client?: ClientHandler,

  /** Defines a replacement for various methods when they fail. **/
  error?: {
    $: ErrorHandler<APIHandler>;
    loader?: ErrorHandler<APIHandler>;
    action?: ErrorHandler<APIHandler>;
    view?:   ErrorHandler<ViewHandler>;
  },

  /** - FRAMEWORK ONLY -
   * After processing, splat routes are internally named "$", and a reference to their user-defined name is set here.
   **/
  _splat?: string,
  /** - FRAMEWORK ONLY -
   * Once per route call, the framework internally assigns the current route value to this element.
   * Note that this is per-request specific, not route-object related.
   */
  _splatValue?: string,
}