import { obfuscate } from "../libs/obfuscate.js";
import { components, routes, splats } from "./compiler.js";
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
    data = {};
    componentsCount = 0;
    GenerateElementId = () => `${obfuscate(this.componentsCount++)}`;
    getRoute = () => {
        if (this.route in routes)
            return routes[this.route];
        else if (this.route in components)
            return components[this.route];
    };
    /**
     * Fetches a component and instantiate it.
     * A bundled component is automatically attached to the route resolution system, meanining this component
     * likely has only a few instances variations possible.
     * On the opposite, and unbundled component will have its js and css resolved independently.
     */
    Components = (path, bundled = true) => {
        const route = path;
        if (!(route in components)) {
            App.logger("ctx").log(`Attempting to render an inexisting component  ::  ${route}`);
            return "";
        }
        const md = components[route];
        return md.view?.[0](this, () => "");
    };
    [Symbol.dispose]() {
        // Purge potentially large objects early.
        delete this.body;
        this.data = {};
        this.query = {};
    }
}
