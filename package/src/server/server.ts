import http from "node:http";
import https from "node:https";

const defaultOptions = {
  mode: "auto" as "auto" | "http" | "https",
  cert: "",
  key:  "",
  ports: [80, 443] as [number, number]
}

class _Server
{
  private serverInstance!: http.Server;
  public readonly ports: [number, number];

  public readonly isSSL: boolean;
  
  constructor(options?: Partial<typeof defaultOptions>)
  {
    const opts = { ...defaultOptions, ...options };
    this.ports = opts.ports;
    this.isSSL = false;

    if (opts.mode === "http")
      this.serverInstance = http.createServer(this.handler);
    else
    {
      try {
        this.serverInstance = https.createServer(
          { cert: opts.cert, key: opts.key },
          this.handler
        );
        this.isSSL = true;
      }
      catch(e)
      {
        if (opts.mode === "auto")
        {
          $log`$c37INFO$c0::$c36Server$c0::Auto::https initialization failed - shifting to http.`;
          this.serverInstance = http.createServer(this.handler);
        }
        else
          throw $err`$c31ERROR$c0::$c36Server$c0::Could not create an https server: ${e}`;
      }
    }
  }

  private async handler (req: http.IncomingMessage, res: http.ServerResponse)
  {
    const ctx = $context(req, res, {
      isSSL: this.isSSL
    });

    for (const middleware of $registry.GetAllOfType<Middleware>("Server:Middleware"))
    {
      try   { await middleware.handler(ctx) }
      catch { if (!middleware.continueOnFailure) return ctx.end() }
    }
    
    // TODO: serve client on GET, solve data loaders on POST
  }

  public listen(port?: number, log = true)
  {
    let p: number;

    if (this.serverInstance instanceof https.Server)
    {
      p = port ?? this.ports[1];
      this.serverInstance.listen(p);
      log ?? $log`$c37INFO$c0::$c36Server$c0::Server listening on https://localhost:${p}`;
      return `https://localhost:${p}`;
    }
    else
    {
      p = port ?? this.ports[0];
      this.serverInstance.listen(port ?? this.ports[0]);
      log ?? $log`$c37INFO$c0::$c36Server$c0::Server listening on http://localhost:${p}`;
      return `http://localhost:${p}`;
    }
  }
}

const serverFactory = (
  options?: Partial<typeof defaultOptions>
) => new _Server(options) as Server;

declare global
{
  var $server: typeof serverFactory;
  interface Server extends _Server {}
}
$globalize("$server", serverFactory);