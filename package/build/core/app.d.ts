import { App as Interface } from "./interfaces.js";
export interface App extends Interface {
    routes: RoutePart;
    address: string;
}
export declare class App {
    constructor();
    Compile(folder: string): Promise<RoutePart>;
}
declare global {
    var App: InstanceType<typeof import("./app.js").App>;
    type App = typeof import("./app.js").App;
}
