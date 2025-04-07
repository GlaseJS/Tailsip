export const isBot = (request) => {
    const userAgent = request.headers["user-agent"] || "";
    return /bot|crawl|spider|slurp/i.test(userAgent);
};
