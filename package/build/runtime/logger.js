import fs from "node:fs/promises";
import { $ } from "../libs/ansi.js";
import { padLeft } from "../libs/strings.js";
const activeFileHandles = {};
process.on("exit", () => {
    for (const key in activeFileHandles)
        activeFileHandles[key].fh.close().catch();
});
export const Logger = (opts) => (context) => {
    const log = (mode) => (message) => {
        console[mode](`${$.cyan + padLeft(context, 10) + $.reset} | ${message}`);
    };
    const append = async (data) => {
        const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
        const fileName = `${process.cwd()}/logs/${context}.${date}.log`;
        if (!activeFileHandles[context])
            activeFileHandles[context] = { name: fileName, fh: await fs.open(fileName, "a").catch() };
        if (activeFileHandles[context].name != fileName) {
            const oldHandle = activeFileHandles[context].fh;
            activeFileHandles[context] = { name: fileName, fh: await fs.open(fileName, "a").catch() };
            oldHandle.close().catch();
        }
        fs.appendFile(activeFileHandles[context].fh, $.clear(data)).catch();
    };
    return {
        heed: opts.mode == "development" ?
            () => console.trace() :
            () => { },
        log: opts.mode == "development" ?
            log("log") :
            opts.logLevel == "all" ?
                (message) => append(opts.format("log", message)) :
                () => { },
        debug: opts.mode == "development" ?
            log("debug") :
            () => { },
        warn: opts.mode == "development" ?
            log("warn") :
            opts.logLevel == "error" ?
                () => { } :
                (message) => append(opts.format("warn", message)),
        error: opts.mode == "development" ?
            log("error") :
            (error) => append(opts.format("err", error.message))
    };
};
