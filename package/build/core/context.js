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
        this.url = new URL(`${App.address}${request.url || ""}`);
        this.pathname = this.url.pathname;
        this.params = this.url.searchParams;
        const file = this.pathname.match(/(.*)\.([0-9a-z]{1,4})$/i);
        if (file) {
            this.pathname = file[1];
            this.fileType = file[2];
        }
        // We preprend an empty route so that the root of the folder always gets processed first.
        const [routes, query] = this.MatchRoute(this.pathname.split("/").filter(Boolean));
        this.routes = routes;
        this.query = query;
    }
    url;
    title;
    meta = [];
    lang;
    fileType;
    pathname;
    params;
    routes;
    query;
    data = {};
    MatchRoute(path) {
        let current = App.routes;
        const solved = [];
        const params = {};
        for (const route of path) {
            if (!current)
                return [solved, params];
            // Match layout
            if ("_layout" in current && current["_layout"].type == "Route")
                solved.push(current["_layout"]);
            // Match named route
            if (route in current) {
                // Match named route file, end of rendering
                if (current[route].type == "Route") {
                    solved.push(current[route]);
                    return [solved, params];
                }
                // Match named route folder, change context
                current = current[route];
            }
            // Match splat route
            else if ("$" in current) {
                // Store route value to the proper splat name
                params[current["$"]._splat] = route;
                // Match splat route file, end of rendering
                if (current["$"].type == "Route") {
                    solved.push(current["$"]);
                    return [solved, params];
                }
                // Match splat route folder, change context
                current = current["$"];
            }
            // Doesn't match, end
            else
                return [solved, params];
        }
        // Path resolution finished but didn't return, try matching layout and index before ending.
        if ("_layout" in current && current["_layout"].type == "Route")
            solved.push(current["_layout"]);
        if ("index" in current && current["index"].type == "Route")
            solved.push(current["index"]);
        return [solved, params];
    }
}
global.Context = Context;
