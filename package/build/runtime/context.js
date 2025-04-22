import { obfuscate } from "../libs/obfuscate.js";
import { routes, splats } from "./compiler.js";
const GetRoute = (path) => {
    let route = path;
    const query = {};
    for (const splat of splats) {
        route = route.replace(new RegExp(`\\${splat.pattern}([a-zA-Z0-9\\-]+)`, "g"), (str, value) => {
            query[splat.name] = value;
            return '$';
        });
    }
    return { route, query };
};
export class Context {
    request;
    response;
    headers;
    body;
    constructor(request, response, headers, body) {
        this.request = request;
        this.response = response;
        this.headers = headers;
        this.body = body;
        this.url = new URL(App.address + (request.url?.slice(1) || ""));
        this.pathname = this.url.pathname;
        this.params = this.url.searchParams;
        const file = this.pathname.match(/(.*)\.([0-9a-z]{1,4})$/i);
        this.id = this.params.get("id") || "";
        if (file) {
            this.pathname = file[1];
            this.fileType = file[2];
        }
        const { query, route } = GetRoute(this.pathname);
        this.query = query;
        this.route = route;
        if (route in routes)
            this.routeModule = routes[route];
    }
    url;
    title = "";
    meta = [];
    lang = "en-US";
    fileType;
    id;
    pathname;
    params;
    route;
    query;
    routeModule;
    data = {};
    componentsCount = 0;
    GenerateElementId = () => `${obfuscate(this.componentsCount++)}`;
    getRoute = () => routes[this.route];
}
