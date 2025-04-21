// @ts-nocheck
// Comment only between /* */ in this method to ease cleanup.
export const client = (function $(handler) {
    const context = {};
    const events = handler(context);
    for (const key in events) {
        const fn = events[key];
        if (key.startsWith("on:")) {
            /* WebSockets */
            continue;
        }
        if (key.startsWith("page:")) {
            window.addEventListener(key.slice(5), fn);
            continue;
        }
        const match = key.match(/^([#.][a-zA-Z]+):(.+)$/);
        if (!match) {
            console.log(`Unrecognized event ${key}`);
            continue;
        }
        const [, selector, event] = match;
        const nodes = document.querySelectorAll(selector);
        nodes.forEach(el => el.addEventListener(event, fn)); /* TODO: wrapper */
    }
}).toString().replace(/\/\*[\s\S]*?\*\//g, '');
