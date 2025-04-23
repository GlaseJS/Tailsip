import { randomUUID } from "node:crypto";
export const integrityShard = randomUUID();
export const Payload = (event, from, data) => ({ event, from, data, integrityShard });
