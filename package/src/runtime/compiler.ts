
import fs from "node:fs";
import type { Context } from "./context.js";

export type InternalRoute = ReturnType<typeof Register.Route>;

export const splats: {
  name: string,
  pattern: string
}[] = [];
export const routes: { [x: string]: InternalRoute } = {}
export const components: { [x: string]: Partial<ReturnType<typeof Register["Component"]>>  } = {};


/** Defines wrappers for certain user provided methods */
const Register = ({
  View: (route: string, md: ComponentModule) => ({
    view: [(ctx: Context, next: () => string) =>
    {
      const id = ctx.GenerateElementId();

      if (md.style)  ctx.meta.push({ type: "link", rel: "stylesheet", href: md.scoped ? `${route}.css?id=${id}` : `${route}.css` });
      if (md.client) ctx.meta.push({ type: "script", src: md.scoped ? `${route}.js?id=${id}` : `${route}.js` });
      return md.view?.(ctx, next).replace(">", ` id="${id}">`) || "";
    }],
    client: md.client ?
      (id: string) =>
        md.client!.toString().replace(/(["'])\$:([a-zA-Z]+)\1/gm, (_, quote, event) => `"#${id}:${event}"`) :
        undefined,
    style: md.style ?
      (id: string) => md.scoped ?
        (ctx: Context) => md.style!(ctx).replace(/^(.*{\s*)$/gm, (_, line) => `#${id} ${line}`) :
        md.style : undefined
  }),
  Route: (route: string, md: RouteModule) => ({
    ...md, ...Register.View(route, md),
    loader: md.loader? [md.loader] : []
  }),
  Component: (route: string, md: ComponentModule) => ({
    ...md, ...Register.View(route, md)
  })
});

// We load components before routes,
// but the path recognition is identical for both so they're grouped in a single method.
// Some routes depend on components hence the split to initialize components first.
/** Load and Compile modules **/
const Compile = async (folder: string, route: string, opts: {
  isComponents: boolean,
  mode: "Routes" | "Components"
}) => 
{
  if (!fs.existsSync(folder)) return;
  const content = fs.readdirSync(folder);

  for (const file of content)
  {
    const fullPath = `${folder}/${file}`;
    const stats = fs.statSync(fullPath);

    let base = file.endsWith(".js") ? file.slice(0, -3) : file;
    if (base == "index") base = "";

    const componentRegex = fullPath.match(/^(.*)\.?components?$/);
    const isComponent = !!componentRegex || opts.isComponents;
    base = componentRegex?.[1] || base;

    const isSplat = base.startsWith('$');
    let splatName = "";
    if (isSplat) base = base.replace(/\$([a-zA-Z\@\$]+)/g, (str, name) => {
      splatName = stats.isDirectory() ? name + "/" : name;
      splats.push({
        name, pattern: route + splatName
      });
      return '$';
    });
    const fullRoute = route+base;

    if (stats.isDirectory())
    {
      if (isComponent && opts.mode == "Routes") continue; // skip component folders that are mixed in routes.
      if (base.startsWith("_")) await Compile(fullPath, route, opts);
      else                      await Compile(fullPath, fullRoute, opts);
    }
    else if (!isComponent)
    {
      if (opts.mode == "Components") continue;
      const md =  {
        ...await import(`file://${process.cwd()}/${fullPath}`) as RouteModule,
        type: "Route" as const,
        _splatName: splatName,
      };
      if (typeof md.scoped == "undefined") md.scoped = true;

      routes[fullRoute] = Register.Route(fullRoute, md);
    }
    else
    {
      if (opts.mode == "Routes") continue;
      const md = {
        ...await import(`file://${process.cwd()}/${fullPath}`) as ComponentModule
      };
      if (typeof md.scoped == "undefined") md.scoped = true;

      components[base] = Register.Component(fullRoute, md);
    }
  }
}

/** Merges inherited layout elements into single route's loader/view arrays for fast flat access **/
const Flatten = async () => {
  const temp : {[x: string]: {
    loader: InternalRoute["loader"],
    error: InternalRoute["error"],
    view: InternalRoute["view"]
  }} = {};

  for (const route in routes)
  {
    const md = routes[route];

    temp[route] = {} as any;

    const bits = ["", ...route.split("/").filter(Boolean)];
    let fullRoute = "";
    for (let i = 0; i < bits.length; i++)
    {
      fullRoute += bits;
      const layoutRoute =  `${fullRoute}/_layout`;
      const layout = routes[layoutRoute];

      if (!layout || layoutRoute == route) continue;

      temp[route].loader = [...layout.loader, ...md.loader];
      temp[route].view =   [...md.view, ...layout.view];
      temp[route].error = { ...layout.error, ...md.error };
    }
  }

  for (const route in temp)
  {
    routes[route] = { ...routes[route], ...temp[route] };
    delete temp[route];
  }
}

if (Config.tailsip.componentsFolder != Config.tailsip.routesFolder)
  await Compile(Config.tailsip.componentsFolder, "/", {
    isComponents: true, mode: "Components"
  });

await Compile(Config.tailsip.routesFolder, "/", {
  isComponents: true, mode: "Components"
});

await Compile(Config.tailsip.routesFolder, "/", {
  isComponents: false, mode: "Routes"
});
await Flatten();