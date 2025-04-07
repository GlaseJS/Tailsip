/** Used to easily load json files **/
declare const requireHelper: NodeJS.Require;
declare global {
    var require: typeof requireHelper;
}
export {};
