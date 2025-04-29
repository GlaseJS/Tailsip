#!/usr/bin/env node
import { existsSync, watch as createWatch } from "fs";
import { exec, execFile } from "node:child_process";
let timeouts = [null, null];
const debounce = (callback, ms, timeoutId) => () => {
    if (timeouts[timeoutId])
        return;
    timeouts[timeoutId] = setTimeout(() => {
        timeouts[timeoutId] = null;
        callback();
    }, ms);
};
let subprocess;
const spawnOptions = { stdio: "inherit", cwd: process.cwd(), env: process.env };
const getBin = (cmd) => {
    const local = `${process.cwd()}/node_modules/.bin/${cmd + (process.platform === "win32" ? ".cmd" : "")}`;
    return existsSync(local) ? local : cmd;
};
const tsc = getBin("tsc");
const end = () => new Promise((resolve) => {
    if (!subprocess)
        return resolve();
    console.log(`tailsip-dev> Closing.`);
    subprocess.once("exit", () => {
        subprocess?.stdout?.unpipe(process.stdout);
        subprocess = null;
        resolve();
    });
    subprocess.kill("SIGKILL");
});
const watch = createWatch(process.cwd(), { recursive: true }, (_, filename) => {
    if (!filename)
        return;
    if (filename.startsWith("build") ||
        filename.startsWith("node_modules") ||
        filename.startsWith("public"))
        return;
    restart();
});
let restarting = false;
const restart = debounce(async () => {
    if (restarting)
        return;
    restarting = true;
    await end();
    console.log(`tailsip-dev> Building...`);
    debounce(() => {
        const build = exec(tsc, spawnOptions);
        build.on("exit", (code) => {
            subprocess = execFile("node", [`${process.cwd()}/node_modules/tailsip/build/server.js`], (err, stdout, stderr) => {
                console.log(stdout);
            });
            subprocess.stdout?.pipe(process.stdout);
            restarting = false;
        });
    }, 200, 1)();
}, 200, 0);
process.on("exit", () => end());
restart();
