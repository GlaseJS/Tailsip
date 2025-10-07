
const defaultMiddleware = {
  type: "Server:Middleware" as const,
  handler: async (ctx: Context) => {},
  continueOnFailure: false
};

const middlewareFactory = (
  handler: Middleware["handler"],
  opts?: Partial<Middleware>
) => {
  const middleware = { ...defaultMiddleware, ...opts, handler };

  $registry.Register(middleware);

  return middleware;
}

declare global {
  var $middleware: typeof middlewareFactory;
  type Middleware = typeof defaultMiddleware;
}
$globalize("$middleware", middlewareFactory);