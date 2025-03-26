


import { readdirSync, statSync } from "node:fs";
import { Router as _ } from "../options";

type Route = {
  get: () => void;
};

let RouteCache: {
  [x: string]: Route
} = {}

const parseFolder = (folder: string): typeof RouteCache => {
  const content = readdirSync(folder);
  let parsed: typeof RouteCache = {};

  for (const file of content)
  {
    const fullPath = `${folder}/${file}`;
    const stats = statSync(fullPath);

    if (stats.isDirectory) parsed = { ...parsed, ...parseFolder(fullPath) };
    else
    {
      const module = await import(`file://${fullPath}`);
    }
  }

  return parsed;
}

export const Router: _.Component = (opts) => {
  opts.folder;

  const handle = ({ request, response, body }: _.Context) => {
    const cookies = request.headers.cookie;
    const prepath = request.url.split("?");
    const path = prepath[0].split("/");
    const query = prepath[1].split("&")
      .reduce((prev, el) => {
        const q = el.split("=");
        return { ...prev, [q[0]]: q[1] }
      }, {});
      
    const ctx = {
      cookies, query
    }

    let current: Route = RouteCache;
    let error;

    for (const)
  }
}


