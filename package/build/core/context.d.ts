import type { IncomingMessage, ServerResponse } from "node:http";
export declare class Context {
    request: IncomingMessage;
    response: ServerResponse;
    headers: Headers;
    body?: JsonObject | undefined;
    constructor(request: IncomingMessage, response: ServerResponse, headers: Headers, body?: JsonObject | undefined);
    pathname: string;
    params: URLSearchParams;
    routes: RouteModule[];
    query: {
        [x: string]: string;
    };
    data: {};
    MatchRoute(path: string[]): [RouteModule[], {
        [x: string]: string;
    }];
}
declare global {
    type Context = InstanceType<typeof import("./context.js").Context>;
    var Context: typeof import("./context.js").Context;
}
