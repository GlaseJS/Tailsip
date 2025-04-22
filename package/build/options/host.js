export const DefaultOptions = {
    protocol: process.env.NODE_ENV == "production" ? "https" : "http",
    host: process.env.NODE_ENV == "production" ? "" : "localhost",
    port: process.env.NODE_ENV == "production" ? 443 : 80,
    key: "XYZ.key",
    cert: "ABC.crt",
    corsPolicy: process.env.NODE_ENV == "production" ? "strict" : "lax",
    allowedOrigins: process.env.NODE_ENV == "production" ? [] : ["*"],
    clientCachingDuration: process.env.NODE_ENV == "production" ? 7 * 24 * 60 * 60 : 0, // 7 days
    viewCachingDuration: process.env.NODE_ENV == "production" ? 7 * 24 * 60 * 60 : 0, // 7 days
    jsonCachingDuration: process.env.NODE_ENV == "production" ? 8 * 60 * 60 : 0, // 8h
    staticCachingDuration: process.env.NODE_ENV == "production" ? 30 * 24 * 6060 : 0, // 30 days
};
