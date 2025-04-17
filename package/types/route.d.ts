

declare type RouteModule = {
  type: "Route";

  /** Defines a method to execute on GET calls on this route. **/
  loader?: APIHandler,
  /** Defines an action to execute on POST calls on this route. **/
  action?: APIHandler,
  /** 
   * Defines a list of socket interactions dedicated to this page. <br/>
   * NOTE: sockets on the server are global, this only serves as organisational purpose.
   **/
  socket?: SocketHandler,

  /** Defines wether the client-side is scoped) **/
  scoped?: boolean,
  /** Defines a visual element (string) to render for this route. If defined, the route is treated as a view renderer. **/
  view?: ViewHandler,
  /** Defines styles to apply for this page. **/
  style?: StyleHandler,
  /** Defines events to answer to on the client side. Client-side events are page-specific. **/
  client?: ClientHandler,

  /** Defines a replacement for various methods when they fail. **/
  error?: {
    $?: ErrorHandler<APIHandler>;
    loader?: ErrorHandler<APIHandler>;
    action?: ErrorHandler<APIHandler>;
    view?:   ErrorHandler<ViewHandler>;
  },

  /**
   * 
   **/
  _splatName: string,
  /** - FRAMEWORK ONLY -
   * Once per route call, the framework internally assigns the current route value to this element.
   * Note that this is per-request specific, not route-object related.
   */
  _splatValue?: string,
}