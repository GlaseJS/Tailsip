import { existsSync } from "node:fs";
global.Overrides = {};
const overridesPath = `${process.cwd()}/build/tailsip.overrides.js`;
if (existsSync(overridesPath))
    require(overridesPath);
