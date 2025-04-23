import type { Context } from "./context.js";
export type InternalRoute = ReturnType<typeof Register.Route>;
export declare const splats: {
    name: string;
    pattern: string;
}[];
export declare const routes: {
    [x: string]: InternalRoute;
};
export declare const components: {
    [x: string]: Partial<ReturnType<typeof Register["Component"]>>;
};
export declare const sockets: {
    [id: string]: ((ctx: SocketHandlerArgs) => any)[];
};
export declare let usesSockets: boolean;
/** Defines wrappers for certain user provided methods */
declare const Register: {
    View: (route: string, md: ComponentModule) => {
        view: ((ctx: Context, next: () => string) => string)[];
        client: ((id: string) => string) | undefined;
        style: ((id: string) => StyleHandler | undefined) | undefined;
    };
    Route: (route: string, md: RouteModule) => {
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
    Component: (route: string, md: ComponentModule) => {
        view: ((ctx: Context, next: () => string) => string)[];
        client: ((id: string) => string) | undefined;
        style: ((id: string) => StyleHandler | undefined) | undefined;
        scoped?: boolean;
    };
};
export {};
