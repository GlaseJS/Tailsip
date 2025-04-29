import type { IncomingMessage, ServerResponse } from "node:http";
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
    data: {
        [x: string]: any;
    };
    private componentsCount;
    GenerateElementId: () => string;
    getRoute: () => {
        view: ((ctx: Context, next: () => string) => string)[];
        client: ((id: string) => string) | undefined;
        style: ((id: string) => StyleHandler | undefined) | undefined;
        scoped?: boolean;
    } | undefined;
    /**
     * Fetches a component and instantiate it.
     * A bundled component is automatically attached to the route resolution system, meanining this component
     * likely has only a few instances variations possible.
     * On the opposite, and unbundled component will have its js and css resolved independently.
     */
    Components: (path: string, bundled?: boolean) => string | undefined;
    [Symbol.dispose](): void;
}
declare global {
    type Context = InstanceType<typeof Context>;
}
