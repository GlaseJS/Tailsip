import { createRequire } from "node:module";
/** Used to easily load json files **/
const requireHelper = createRequire(import.meta.url);
global.require = requireHelper;
