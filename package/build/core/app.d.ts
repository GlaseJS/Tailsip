import { App as Interface } from "./interfaces.js";
export interface App extends Interface {
    address: URL;
}
export declare class App {
}
declare global {
    var App: InstanceType<typeof import("./app.js").App>;
    type App = typeof import("./app.js").App;
}
