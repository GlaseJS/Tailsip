


import fs, { FileHandle } from "node:fs/promises";
import { Logger as _ } from "../options";

const activeFileHandles: {[x: string]: { fh: FileHandle, name: string}} = {};

process.on("exit", () => {
  for (const key in activeFileHandles)
    activeFileHandles[key].fh.close().catch();
});

export const Logger: _.Component = (app, opts) => (context) => {
  const append = async (data: string) => {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const fileName = `${process.cwd()}/logs/${context}.${date}.log`
    
    if (!activeFileHandles[context])
      activeFileHandles[context] = { name: fileName, fh: await fs.open(fileName, "a").catch() };

    if (activeFileHandles[context].name != fileName)
    {
      const oldHandle = activeFileHandles[context].fh;
      activeFileHandles[context] = { name: fileName, fh: await fs.open(fileName, "a").catch() };
      oldHandle.close().catch();
    }

    fs.appendFile(activeFileHandles[context].fh, data).catch();
  };

  return {
    log: opts.mode == "development" ?
      (message) => console.log(message) :
      opts.logLevel == "all" ?
        (message) => append(opts.format("log", message)) :
        () => {},
    heed: opts.mode == "development" ?
      () => console.trace() :
      () => {},
    debug: opts.mode == "development" ?
      (message) => console.debug(message) :
      () => {},
    warn: opts.mode == "development" ?
      (message) => console.warn(message) :
      opts.logLevel == "error" ?
        () => {} :
        (message) => append(opts.format("warn", message)),
    error: opts.mode == "development" ?
      (error) => console.error(error) :
      (error) => append(opts.format("err", error.message))
  };
};


