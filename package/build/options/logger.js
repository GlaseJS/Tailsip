export const DefaultOptions = {
    mode: process.env.NODE_ENV || "development",
    format: (type, message) => `${new Date().toISOString()} [${type.toUpperCase()}]: ${message}`,
    logLevel: "all"
};
