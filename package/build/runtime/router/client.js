import { ClientWrapper } from "../../libs/clientWrapper.js";
export const client = ClientWrapper(function $(handler) {
    const context = {};
    const events = handler(context);
    for (const key in events) {
        const fn = events[key];
        if (key.startsWith("on:")) {
            /* WebSockets */
            continue;
        }
        if (key.startsWith("page:")) {
            /* @ts-ignore */
            window.addEventListener(key.slice(5), fn);
            continue;
        }
        const match = key.match(/^([#.][a-zA-Z]+):(.+)$/);
        if (!match) {
            console.log(`Unrecognized event ${key}`);
            continue;
        }
        const [, selector, event] = match;
        /* @ts-ignore */
        const nodes = document.querySelectorAll(selector);
        nodes.forEach((el) => el.addEventListener(event, fn)); /* TODO: wrap with handling */
    }
});
