// src/autumn.ts
import { Autumn } from "autumn-js";

export const autumn = new Autumn({ 
    secretKey: process.env.AUTUMN_SANDBOX_SECRET_KEY!,
});