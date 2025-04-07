


import { existsSync } from "node:fs";
import { Overrides as Interface } from "./interfaces.js";

declare global {
  var Overrides: Interface;
}

global.Overrides = {};
const overridesPath = `${process.cwd()}/build/tailsip.overrides.js`;

if (existsSync(overridesPath)) require(overridesPath);