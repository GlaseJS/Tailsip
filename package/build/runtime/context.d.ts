import type { IncomingMessage, ServerResponse } from "node:http";
import { InternalRoute } from "./compiler.js";
export declare class Context {
    request: IncomingMessage;
    response: ServerResponse;
    headers: Headers;
    body?: JsonObject | undefined;
    constructor(request: IncomingMessage, response: ServerResponse, headers: Headers, body?: JsonObject | undefined);
    url: URL;
    title: string;
    meta: MetaHandler;
    lang: string;
    fileType?: string;
    id: string;
    pathname: string;
    params: URLSearchParams;
    route: string;
    query: {
        [x: string]: string;
    };
    routeModule?: InternalRoute;
    data: {};
    private componentsCount;
    GenerateElementId: () => string;
    getRoute: () => {
        loader: APIHandler[];
        view: ((ctx: Context, next: () => string) => string)[];
        client: ((id: string) => string) | undefined;
        style: ((id: string) => StyleHandler | undefined) | undefined;
        type: "Route";
        action?: APIHandler;
        socket?: SocketHandler;
        scoped?: boolean;
        error?: {
            $?: ErrorHandler<APIHandler>;
            loader?: ErrorHandler<APIHandler>;
            action?: ErrorHandler<APIHandler>;
            view?: ErrorHandler<ViewHandler>;
        };
        _splatName: string;
        _splatValue?: string;
    };
}
declare global {
    type Context = InstanceType<typeof Context>;
}
