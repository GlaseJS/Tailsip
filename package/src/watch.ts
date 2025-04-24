#!/usr/bin/env node
import { existsSync, watch } from "fs";
import { exec } from "node:child_process";

const debounce = (fn: Function, delay: number) => {
  let timeout: NodeJS.Timeout;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(), delay);
  };
};

let subprocess: ReturnType<typeof exec> | null;
const spawnOptions = { stdio: "inherit", cwd: process.cwd(), env: process.env } as const;

const getBin = (cmd: string) => {
  const local = `${process.cwd()}/node_modules/.bin/${cmd + (process.platform === "win32" ? ".cmd" : "")}`;
  return existsSync(local) ? local : cmd;
}

const tsc = getBin("tsc");
const tailsip = getBin("tailsip");

const restart = debounce(() => {
  if (subprocess)
  {
    subprocess.kill();
    subprocess = null;
  }

  console.log(`tailsip-dev> Rebuilding...`);
  
  const build = exec(tsc, spawnOptions);
  build.on("exit", (code) => {
    if (code != 0) return;

    console.log(`tailsip-dev> Starting server.`);

    subprocess = exec(tailsip, spawnOptions);
    subprocess.stdout?.pipe(process.stdout);
  });
}, 150);

process.on("beforeExit", () => {
  subprocess?.kill();
});

watch(process.cwd(), { recursive: true }, (_, filename) => {
  if (!filename) return;
  if (filename.startsWith("build")) return;
  console.log(filename);
  restart();
});

restart();
