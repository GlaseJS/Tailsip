

declare type ComponentModule = {
  /** Defines wether the client-side is scoped) **/
  scoped?: boolean,
  /** Defines a visual element (string) to render for this route. If defined, the route is treated as a view renderer. **/
  view?: ViewHandler,
  /** Defines styles to apply for this page. **/
  style?: StyleHandler,
  /** Defines events to answer to on the client side. Client-side events are page-specific. **/
  client?: ClientHandler,
}