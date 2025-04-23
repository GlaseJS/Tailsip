import { randomUUID } from "node:crypto";


export const integrityShard = randomUUID();
export const Payload = (event: string, from: string, data: JsonObject) => ({ event, from, data, integrityShard });
