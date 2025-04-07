export const DefaultOptions = {
    protocol: process.env.NODE_ENV == "production" ? "https" : "http",
    host: process.env.NODE_ENV == "production" ? "" : "localhost",
    port: process.env.NODE_ENV == "production" ? 443 : 80,
    key: "XYZ.key",
    cert: "ABC.crt",
    corsPolicy: process.env.NODE_ENV == "production" ? "strict" : "lax",
    allowedOrigins: process.env.NODE_ENV == "production" ? [] : ["*"],
};
