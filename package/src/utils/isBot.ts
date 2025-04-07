import type { IncomingMessage } from "node:http";

export const isBot = (request: IncomingMessage): boolean => {
  const userAgent = request.headers["user-agent"] || "";
  return /bot|crawl|spider|slurp/i.test(userAgent);
}