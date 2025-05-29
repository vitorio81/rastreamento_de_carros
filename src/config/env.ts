// config/env.ts
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/../../.env" });

export const config = {
  appId: process.env.APP_ID,
  secretKey: process.env.API_SECRET_KEY,
  hostAuth: process.env.HOST_AUTH,
  hostStatus: process.env.HOST_STATUS,
  logLevel: process.env.LOG_LEVEL || "info",
};
