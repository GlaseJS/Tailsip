import type { CompilerOptions } from "typescript";
import { Config as Interface } from "./interfaces.js";
type FullConfig<T> = {
    [x in keyof T]: Required<T[x]>;
};
type TSConfig = {
    compilerOptions?: CompilerOptions;
    include?: string[];
    exclude?: string[];
    files?: string[];
};
declare global {
    var Config: FullConfig<Interface>;
    var TSConfig: TSConfig;
}
export {};
